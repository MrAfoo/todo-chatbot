"""Conversation schemas for request/response validation."""

from datetime import datetime
from pydantic import BaseModel, Field


class ConversationMessageBase(BaseModel):
    """Base schema for conversation messages."""

    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")


class ConversationMessageCreate(ConversationMessageBase):
    """Schema for creating a conversation message."""

    pass


class ConversationMessageResponse(ConversationMessageBase):
    """Schema for conversation message response."""

    id: int
    conversation_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class ConversationBase(BaseModel):
    """Base schema for conversations."""

    pass


class ConversationCreate(ConversationBase):
    """Schema for creating a conversation."""

    pass


class ConversationResponse(ConversationBase):
    """Schema for conversation response."""

    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    messages: list[ConversationMessageResponse] = []

    model_config = {"from_attributes": True}


class ChatRequest(BaseModel):
    """Schema for chat request."""

    message: str = Field(..., description="User's message")
    conversation_id: int | None = Field(
        None, description="Optional conversation ID to continue existing conversation"
    )


class ChatResponse(BaseModel):
    """Schema for chat response."""

    message: str = Field(..., description="Assistant's response")
    conversation_id: int = Field(..., description="Conversation ID for context")
