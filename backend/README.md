# Todo Backend API

FastAPI backend for the full-stack todo application with JWT authentication, AI chatbot, and PostgreSQL database.

## Features

- 🤖 AI-powered chatbot using Groq Compound (`groq/compound`) - FREE!
- 🧠 MCP (Model Context Protocol) server for AI tool integration
- 🔐 JWT-based authentication (Better Auth compatible)
- 👤 User registration and login
- ✅ CRUD operations for tasks
- 💬 Conversation history storage
- 🗄️ PostgreSQL database with SQLAlchemy ORM
- 🔄 Database migrations with Alembic
- 🧪 Comprehensive test coverage (15/15 passing)

## Requirements

- Python 3.13+
- PostgreSQL 14+
- UV (recommended) or pip

## Quick Start

### 1. Install Dependencies

```bash
cd backend
uv sync
```

### 2. Set Up Database and Environment

```bash
# Create PostgreSQL database
createdb todo_db

# Copy environment file
cp .env.example .env

# Edit .env with your credentials:
# - DATABASE_URL (PostgreSQL connection)
# - BETTER_AUTH_SECRET (must match frontend)
# - GROQ_API_KEY (get free key at https://console.groq.com)
```

### 3. Run Database Migrations

```bash
uv run alembic upgrade head
```

### 4. Start Development Server

```bash
uv run uvicorn app.main:app --reload --port 8000
```

API will be available at: http://localhost:8000
API documentation: http://localhost:8000/docs

## Development

### Running Tests

```bash
uv run pytest
uv run pytest --cov-report=html  # Generate HTML coverage report
```

### Database Migrations

```bash
# Create a new migration
uv run alembic revision --autogenerate -m "description"

# Apply migrations
uv run alembic upgrade head

# Rollback migration
uv run alembic downgrade -1
```

### Code Quality

```bash
# Format code
uv run black app tests

# Lint
uv run flake8 app tests

# Type checking
uv run mypy app
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Tasks (JWT Required)
- `GET /api/{user_id}/tasks` - List all tasks
- `POST /api/{user_id}/tasks` - Create new task
- `GET /api/{user_id}/tasks/{task_id}` - Get task by ID
- `PUT /api/{user_id}/tasks/{task_id}` - Update task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete task

### AI Chat (JWT Required)
- `POST /api/chat` - Send message to AI chatbot
- `GET /api/chat` - List user's conversations
- `GET /api/chat/{conversation_id}` - Get conversation history

**AI Capabilities:**
The chatbot can create, read, update, and delete tasks through natural language conversation using MCP tools.

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration (GROQ_API_KEY, BETTER_AUTH_SECRET)
│   ├── database.py          # Database connection
│   ├── mcp_server.py        # MCP server for AI tools
│   ├── models/              # SQLAlchemy models (User, Task, Conversation)
│   ├── schemas/             # Pydantic schemas
│   ├── routers/             # API route handlers (auth, tasks, chat)
│   └── services/            # Business logic (AI agent, auth)
├── tests/                   # Test files (15/15 passing)
├── alembic/                 # Database migrations
├── requirements.txt         # Dependencies (includes groq)
└── README.md
```

## Environment Variables

Required environment variables in `.env`:

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/todo_db

# Authentication (must match frontend BETTER_AUTH_SECRET)
BETTER_AUTH_SECRET=your-secret-key-min-32-chars-long

# AI (get free key at https://console.groq.com)
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=groq/compound

# Optional
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000
```
