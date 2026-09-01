# Full-Stack AI-Powered Todo Application

A modern full-stack web application with **Better Auth** authentication, **AI Chatbot** powered by **Groq** (free!), and **FastAPI** backend.

## 🎯 Overview

This is a production-ready todo application featuring:

- 🤖 **AI Chatbot**: Manage tasks conversationally using Groq Compound (`groq/compound`) (FREE!). Also Voice cmd feature enabled!
- 🔐 **Better Auth + JWT**: Secure authentication with token-based API access
- ✅ **Task Management**: Full CRUD operations with user isolation
- 🧠 **MCP Server**: Model Context Protocol for AI tool integration
- 👤 **Multi-user Support**: Each user has their own tasks
- 🎨 **Modern UI**: Responsive design with Tailwind CSS and dark mode
- 🗄️ **PostgreSQL Database**: Persistent data storage
- 🔒 **Stateless Auth**: Frontend and backend verify JWT tokens independently
- 🧪 **Comprehensive Tests**: 15/15 backend tests passing

## 🚀 Quick Start (5 Minutes)

### 1. Set Up Environment Variables

Create `.env` files with the **SAME SECRET KEY** in both:

**backend/.env**:
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/todo_db
BETTER_AUTH_SECRET=your-secret-key-min-32-chars-long-change-in-production
GROQ_API_KEY=gsk_your_groq_api_key_here
```

**frontend/.env.local**:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key-min-32-chars-long-change-in-production
DATABASE_URL=postgresql://postgres:password@localhost:5432/todo_db
```

⚠️ **CRITICAL**: 
- The `BETTER_AUTH_SECRET` must be **identical** in both files!
- Get your **FREE** Groq API key at https://console.groq.com (takes 2 minutes!)

### 2. Set Up Database

```bash
# Create PostgreSQL database
createdb todo_db

# Run migrations
cd backend
uv sync
uv run alembic upgrade head

cd ../frontend
npm install
npx better-auth migrate
```

### 3. Start Services

```bash
# Terminal 1 - Backend
cd backend
uv run uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **AI Chat**: http://localhost:3000/chat (after login)

## 📖 Documentation

- **[GROQ_SETUP.md](./GROQ_SETUP.md)** - How to get your free Groq API key and setup
- **[backend/README.md](./backend/README.md)** - Backend API documentation
- **[frontend/README.md](./frontend/README.md)** - Frontend documentation

## 🏗️ Architecture

### How JWT Authentication Works

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                       │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │ Better Auth  │ ──▶  │   JWT Token  │                    │
│  │   Server     │      │  (7 days)    │                    │
│  └──────────────┘      └──────────────┘                    │
│                               │                             │
│                               ▼                             │
│                       Authorization: Bearer <token>         │
└───────────────────────────────┼─────────────────────────────┘
                                │
                   Shared Secret: BETTER_AUTH_SECRET
                                │
┌───────────────────────────────┼─────────────────────────────┐
│                               ▼                             │
│                       ┌──────────────┐                      │
│                       │  JWT Verify  │                      │
│                       │  Middleware  │                      │
│                       └──────────────┘                      │
│                               │                             │
│                               ▼                             │
│                       ┌──────────────┐                      │
│                       │  Task Routes │                      │
│                       │  (Filtered)  │                      │
│                       └──────────────┘                      │
│                    Backend (FastAPI)                        │
└─────────────────────────────────────────────────────────────┘
```

**Flow**:
1. User logs in → Better Auth issues JWT token (stored in HTTP-only cookie)
2. Frontend makes API call → Token attached to `Authorization` header
3. Backend verifies token → Uses shared secret to validate signature
4. Backend identifies user → Decodes user ID from token
5. Backend filters data → Returns only user's own tasks

## 📚 Tech Stack

### Backend
- **Framework**: FastAPI
- **AI Provider**: Groq (`groq/compound`) - FREE!
- **MCP Server**: Model Context Protocol SDK
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy 2.0
- **Migrations**: Alembic
- **Authentication**: JWT verification with python-jose
- **Password Hashing**: Passlib + bcrypt
- **Testing**: Pytest (15/15 passing ✅)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Authentication**: Better Auth with JWT plugin
- **Styling**: Tailwind CSS
- **Theme**: Dark/Light mode support
- **HTTP Client**: Axios (auto-attaches JWT tokens)
- **Testing**: Jest + React Testing Library

## 🔒 Security Features

| Feature | Description |
|---------|-------------|
| **User Isolation** | Each user only sees their own tasks |
| **Stateless Auth** | Backend doesn't need to call frontend to verify users |
| **Token Expiry** | JWT tokens expire after 7 days |
| **Signature Verification** | Tokens can't be forged without the secret key |
| **Password Hashing** | Better Auth handles secure bcrypt password storage |
| **CORS Protection** | Restricted to allowed origins |

## 🧪 Testing

### Backend Tests
```bash
cd backend
uv run pytest                    # Run all tests
uv run pytest --cov-report=html  # With coverage report
```

**Results**: ✅ 15/15 tests passing
- Authentication: 8/8 tests
- Task CRUD: 7/7 tests
- User isolation verified
- JWT verification working

### Frontend Tests
```bash
cd frontend
npm test              # Run all tests
npm run test:watch    # Watch mode
```

## 🛠️ Development

### Database Migrations

**Backend (Alembic)**:
```bash
cd backend
uv run alembic revision --autogenerate -m "description"
uv run alembic upgrade head
uv run alembic downgrade -1
```

**Frontend (Better Auth)**:
```bash
cd frontend
npx better-auth migrate
```

### Code Quality

**Backend**:
```bash
cd backend
uv run black app tests      # Format
uv run flake8 app tests     # Lint
uv run mypy app             # Type check
```

**Frontend**:
```bash
cd frontend
npm run lint                # ESLint
npm run build               # Production build
```

## 📝 API Endpoints

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
- `POST /api/chat` - Send message to AI chatbot, get response
- `GET /api/chat` - List user's conversations
- `GET /api/chat/{conversation_id}` - Get conversation history

All endpoints require `Authorization: Bearer <token>` header and enforce user ownership.

## 🤖 AI Chatbot Features

The AI chatbot can help you manage tasks conversationally:

**Example Commands:**
- "Create a task to buy groceries"
- "Show me all my tasks"
- "Mark task 5 as complete"
- "Update task 3 description to 'Buy milk and eggs'"
- "Delete the task about groceries"
- "Show me only incomplete tasks"

**MCP Tools Available:**
- `create_task` - Create new tasks
- `list_tasks` - View all or filtered tasks
- `get_task` - Get specific task details
- `update_task` - Modify task properties
- `delete_task` - Remove tasks
- `mark_task_complete` / `mark_task_incomplete` - Toggle completion status

All AI operations are automatically scoped to the authenticated user!

## 🐛 Troubleshooting

### 401 Unauthorized Errors
- ✅ Verify `BETTER_AUTH_SECRET` matches in both .env files
- ✅ Check token is being sent in request headers (DevTools → Network)
- ✅ Try logout and login again to get fresh token

### AI Chatbot Not Working
- ✅ Ensure `GROQ_API_KEY` is set in backend/.env
- ✅ Get your free key at https://console.groq.com
- ✅ Restart backend server after adding the key
- ✅ Check backend logs for any API errors

### Database Connection Errors
- ✅ Ensure PostgreSQL is running: `pg_isready`
- ✅ Check DATABASE_URL in .env files
- ✅ Verify database exists: `psql -l | grep todo_db`

### Better Auth Migration Fails
- ✅ Ensure DATABASE_URL is set in frontend/.env.local
- ✅ Check PostgreSQL permissions
- ✅ Try: `cd frontend && npx better-auth migrate --force`

### CORS Errors
- ✅ Verify backend ALLOWED_ORIGINS includes frontend URL
- ✅ Check both services are running on correct ports
- ✅ Clear browser cache and cookies

## 📦 Project Structure

```
.
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── models/            # SQLAlchemy models (User, Task, Conversation)
│   │   ├── schemas/           # Pydantic schemas  
│   │   ├── routers/           # API endpoints (auth, tasks, chat)
│   │   ├── services/          # JWT verification, AI agent
│   │   ├── mcp_server.py      # MCP server for AI tools
│   │   ├── config.py          # Settings (GROQ_API_KEY, BETTER_AUTH_SECRET)
│   │   └── main.py            # FastAPI app
│   ├── tests/                 # 15 tests (all passing)
│   └── alembic/               # Database migrations
│
├── frontend/                   # Next.js frontend
│   ├── app/                   
│   │   ├── (auth)/            # Login & register pages
│   │   ├── dashboard/         # Task management dashboard
│   │   └── chat/              # AI chatbot interface
│   ├── components/            # React components (Navigation, Tasks, Theme)
│   ├── contexts/              # Theme context for dark mode
│   ├── lib/
│   │   ├── auth-server.ts    # Better Auth config (JWT plugin)
│   │   ├── auth-client.ts    # Client-side auth helpers
│   │   └── api.ts            # Axios client (auto-attaches JWT)
│   └── hooks/                # Custom React hooks
│
├── GROQ_SETUP.md              # Free AI setup guide
└── README.md                  # This file
```

## 🚀 Deployment

### Production Checklist

- [ ] Generate secure `BETTER_AUTH_SECRET` (32+ chars): `openssl rand -base64 32`
- [ ] Set environment variables in production
- [ ] Ensure secrets match in frontend and backend
- [ ] Set up HTTPS/SSL certificates
- [ ] Update `ALLOWED_ORIGINS` with production domain
- [ ] Set `DEBUG=False` in backend
- [ ] Run database migrations
- [ ] Test authentication flow end-to-end

### Environment Variables for Production

**Backend**:
```bash
DATABASE_URL=postgresql://user:pass@host:5432/todo_db
BETTER_AUTH_SECRET=<your-production-secret>
GROQ_API_KEY=<your-groq-api-key>
ALLOWED_ORIGINS=https://yourdomain.com
DEBUG=False
```

**Frontend**:
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
BETTER_AUTH_SECRET=<same-secret-as-backend>
DATABASE_URL=postgresql://user:pass@host:5432/todo_db
```

## 📄 License

This project is built following the Spec-Kit Plus methodology.

## 🤝 Contributing

1. Follow coding standards (backend: PEP 8, frontend: ESLint)
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before committing


