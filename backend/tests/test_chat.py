"""Tests for chat endpoints."""

import pytest


def test_chat_new_conversation(client, test_user, mock_ai_agent):
    """Test starting a new chat conversation."""
    response = client.post(
        "/api/chat",
        json={"message": "Hello, I need help with my tasks"},
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "conversation_id" in data
    assert data["message"] == "I've processed your request successfully!"
    
    # Verify AI agent was called
    mock_ai_agent.chat.assert_called_once()


def test_chat_existing_conversation(client, test_user, mock_ai_agent):
    """Test continuing an existing conversation."""
    # Start a new conversation
    first_response = client.post(
        "/api/chat",
        json={"message": "Create a task"},
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    conversation_id = first_response.json()["conversation_id"]
    
    # Reset mock to clear previous call
    mock_ai_agent.chat.reset_mock()
    
    # Continue the conversation
    response = client.post(
        "/api/chat",
        json={
            "message": "What tasks do I have?",
            "conversation_id": conversation_id,
        },
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["conversation_id"] == conversation_id
    assert "message" in data
    
    # Verify AI agent was called with conversation history
    mock_ai_agent.chat.assert_called_once()
    call_args = mock_ai_agent.chat.call_args
    assert call_args.kwargs["user_message"] == "What tasks do I have?"
    assert len(call_args.kwargs["conversation_history"]) == 2  # Previous user + assistant message


def test_chat_unauthorized(client):
    """Test chat without authentication."""
    response = client.post(
        "/api/chat",
        json={"message": "Hello"},
    )
    assert response.status_code == 401


def test_chat_invalid_conversation_id(client, test_user):
    """Test chat with non-existent conversation ID."""
    response = client.post(
        "/api/chat",
        json={
            "message": "Hello",
            "conversation_id": 99999,
        },
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    assert response.status_code == 404
    assert "Conversation not found" in response.json()["detail"]


def test_get_conversation(client, test_user):
    """Test retrieving a conversation with messages."""
    # Create a conversation with messages
    chat_response = client.post(
        "/api/chat",
        json={"message": "Test message"},
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    conversation_id = chat_response.json()["conversation_id"]
    
    # Get the conversation
    response = client.get(
        f"/api/chat/{conversation_id}",
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == conversation_id
    assert data["user_id"] == test_user["user"]["id"]
    assert len(data["messages"]) == 2  # User message + assistant response
    assert data["messages"][0]["role"] == "user"
    assert data["messages"][0]["content"] == "Test message"
    assert data["messages"][1]["role"] == "assistant"


def test_get_conversation_not_found(client, test_user):
    """Test retrieving a non-existent conversation."""
    response = client.get(
        "/api/chat/99999",
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    assert response.status_code == 404


def test_get_conversation_unauthorized(client):
    """Test retrieving conversation without authentication."""
    response = client.get("/api/chat/1")
    assert response.status_code == 401


def test_list_conversations(client, test_user):
    """Test listing all conversations for a user."""
    # Create two conversations
    client.post(
        "/api/chat",
        json={"message": "First conversation"},
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    client.post(
        "/api/chat",
        json={"message": "Second conversation"},
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    
    # List conversations
    response = client.get(
        "/api/chat",
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert all("id" in conv for conv in data)
    assert all("created_at" in conv for conv in data)
    assert all("message_count" in conv for conv in data)


def test_list_conversations_unauthorized(client):
    """Test listing conversations without authentication."""
    response = client.get("/api/chat")
    assert response.status_code == 401


def test_chat_ai_agent_error_handling(client, test_user, mock_ai_agent):
    """Test that AI agent errors are handled gracefully."""
    # Make the AI agent raise an exception
    mock_ai_agent.chat.side_effect = Exception("API Error")
    
    response = client.post(
        "/api/chat",
        json={"message": "Hello"},
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "error" in data["message"].lower() or "sorry" in data["message"].lower()
