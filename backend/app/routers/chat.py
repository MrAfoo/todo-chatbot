"""Chat endpoint for AI-powered task management."""

from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.conversation import Conversation, ConversationMessage
from app.schemas.conversation import ChatRequest, ChatResponse
from app.services.auth import get_current_user
from app.services.ai_agent import get_ai_agent

router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> ChatResponse:
    """
    Chat endpoint for conversational task management.
    
    This endpoint is stateless - conversation state is persisted to the database.
    The AI agent uses MCP tools to manage tasks.
    
    Args:
        request: Chat request with message and optional conversation_id
        current_user: Current authenticated user from JWT token
        db: Database session
        
    Returns:
        ChatResponse with assistant's message and conversation_id
        
    Raises:
        HTTPException: If conversation not found or unauthorized
    """
    # Get or create conversation
    if request.conversation_id:
        # Load existing conversation
        conversation = (
            db.query(Conversation)
            .filter(
                Conversation.id == request.conversation_id,
                Conversation.user_id == current_user.id,
            )
            .first()
        )
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found",
            )
        
        # Load conversation history
        messages = (
            db.query(ConversationMessage)
            .filter(ConversationMessage.conversation_id == conversation.id)
            .order_by(ConversationMessage.created_at)
            .all()
        )
        
        conversation_history = [
            {"role": msg.role, "content": msg.content}
            for msg in messages
        ]
    else:
        # Create new conversation
        conversation = Conversation(user_id=current_user.id)
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        
        conversation_history = []
    
    # Save user message
    user_message = ConversationMessage(
        conversation_id=conversation.id,
        role="user",
        content=request.message,
    )
    db.add(user_message)
    db.commit()
    
    # Get AI response using MCP tools
    try:
        ai_agent = get_ai_agent()
        assistant_response = ai_agent.chat(
            user_message=request.message,
            conversation_history=conversation_history,
            user_id=current_user.id,
            db=db,
        )
    except Exception as e:
        # Log the error with more details for debugging
        import traceback
        error_details = traceback.format_exc()
        print(f"Error in AI agent: {e}")
        print(f"Full traceback:\n{error_details}")
        assistant_response = (
            "I'm sorry, I encountered an error processing your request. "
            "Please try again or contact support if the issue persists."
        )
    
    # Save assistant message
    assistant_message = ConversationMessage(
        conversation_id=conversation.id,
        role="assistant",
        content=assistant_response,
    )
    db.add(assistant_message)
    db.commit()
    
    return ChatResponse(
        message=assistant_response,
        conversation_id=conversation.id,
    )


@router.get("/{conversation_id}", response_model=dict)
def get_conversation(
    conversation_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> dict:
    """
    Get a conversation and its messages.
    
    Args:
        conversation_id: ID of the conversation
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Conversation with messages
        
    Raises:
        HTTPException: If conversation not found or unauthorized
    """
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
        )
        .first()
    )
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )
    
    messages = (
        db.query(ConversationMessage)
        .filter(ConversationMessage.conversation_id == conversation.id)
        .order_by(ConversationMessage.created_at)
        .all()
    )
    
    return {
        "id": conversation.id,
        "user_id": conversation.user_id,
        "created_at": conversation.created_at,
        "updated_at": conversation.updated_at,
        "messages": [
            {
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at,
            }
            for msg in messages
        ],
    }


@router.get("", response_model=list[dict])
def list_conversations(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[dict]:
    """
    List all conversations for the current user.
    
    Args:
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        List of conversations with basic info
    """
    conversations = (
        db.query(Conversation)
        .filter(Conversation.user_id == current_user.id)
        .order_by(Conversation.updated_at.desc())
        .all()
    )
    
    return [
        {
            "id": conv.id,
            "created_at": conv.created_at,
            "updated_at": conv.updated_at,
            "message_count": len(conv.messages),
        }
        for conv in conversations
    ]


@router.delete("/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conversation(
    conversation_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> None:
    """
    Delete a conversation and all its messages.
    
    Args:
        conversation_id: ID of the conversation to delete
        current_user: Current authenticated user
        db: Database session
        
    Raises:
        HTTPException: If conversation not found or unauthorized
    """
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
        )
        .first()
    )
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )
    
    # Delete all messages in the conversation
    db.query(ConversationMessage).filter(
        ConversationMessage.conversation_id == conversation_id
    ).delete()
    
    # Delete the conversation
    db.delete(conversation)
    db.commit()
