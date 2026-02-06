"""Pytest configuration and fixtures."""

import pytest
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def mock_ai_agent():
    """Create a mock AI agent for testing."""
    mock_agent = Mock()
    mock_agent.chat.return_value = "I've processed your request successfully!"
    return mock_agent


@pytest.fixture
def client(db_session, mock_ai_agent):
    """Create a test client with database dependency override."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    
    # Mock the AI agent to avoid needing GROQ_API_KEY
    with patch('app.routers.chat.get_ai_agent', return_value=mock_ai_agent):
        yield TestClient(app)
    
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(client):
    """Create a test user and return user data with token."""
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123",
    }
    
    # Register user
    response = client.post("/api/auth/register", json=user_data)
    assert response.status_code == 201
    user = response.json()
    
    # Login to get token
    login_response = client.post(
        "/api/auth/login",
        json={"username": user_data["username"], "password": user_data["password"]},
    )
    assert login_response.status_code == 200
    token_data = login_response.json()
    
    return {
        "user": user,
        "token": token_data["access_token"],
        "password": user_data["password"],
    }
