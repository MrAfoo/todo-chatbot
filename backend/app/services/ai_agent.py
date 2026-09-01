"""AI Agent service using Groq and MCP tools."""

import os
import json
from typing import Any
from groq import Groq
from mcp.types import TextContent
from sqlalchemy.orm import Session

from app.mcp_server import task_mcp_server
from app.config import settings


class AIAgent:
    """AI Agent that uses MCP tools to manage tasks."""

    def __init__(self, api_key: str | None = None, model: str | None = None):
        """Initialize the AI Agent with Groq client.
        
        Args:
            api_key: Groq API key. If not provided, will use settings.groq_api_key.
            model: Groq model name. If not provided, will use settings.groq_model.
        """
        api_key = api_key or settings.groq_api_key
        if not api_key:
            raise ValueError("GROQ_API_KEY must be set in .env file or environment variables")
        
        self.client = Groq(api_key=api_key)
        self._model = model

    @property
    def model(self) -> str:
        """Get the model identifier dynamically from settings or explicit override."""
        return self._model or getattr(settings, "groq_model", None) or "groq/compound"
        
        # Get available tools from MCP server
        self.tools = self._get_mcp_tools()

    def _get_mcp_tools(self) -> list[dict[str, Any]]:
        """Get tools from MCP server and convert to OpenAI format."""
        # Define tools manually based on MCP server implementation
        # This avoids complex async initialization issues
        return [
            {
                "type": "function",
                "function": {
                    "name": "create_task",
                    "description": "Create a new task for the user with smart categorization and prioritization",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "integer",
                                "description": "The ID of the user creating the task",
                            },
                            "title": {
                                "type": "string",
                                "description": "The title of the task",
                            },
                            "description": {
                                "type": "string",
                                "description": "Optional description of the task",
                            },
                            "priority": {
                                "type": "string",
                                "enum": ["low", "medium", "high", "urgent"],
                                "description": "Task priority level. Analyze the task and suggest: urgent for deadlines/critical, high for important work, medium for regular tasks, low for nice-to-haves",
                            },
                            "category": {
                                "type": "string",
                                "enum": ["personal", "work", "shopping", "health", "learning", "project", "other"],
                                "description": "Task category. Intelligently categorize based on keywords: work/project for professional tasks, shopping for purchases, health for fitness/medical, learning for education, personal for life tasks",
                            },
                            "due_date": {
                                "type": "string",
                                "description": "Due date in YYYY-MM-DD format. Extract from user's message if they mention dates like 'tomorrow', 'next week', 'by Friday', etc.",
                            },
                        },
                        "required": ["user_id", "title"],
                    },
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "list_tasks",
                    "description": "List all tasks for a user, optionally filtered by completion status",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "integer",
                                "description": "The ID of the user",
                            },
                            "completed": {
                                "type": "boolean",
                                "description": "Filter by completion status (optional)",
                            },
                        },
                        "required": ["user_id"],
                    },
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "get_task",
                    "description": "Get details of a specific task",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "integer",
                                "description": "The ID of the user",
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "The ID of the task",
                            },
                        },
                        "required": ["user_id", "task_id"],
                    },
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "update_task",
                    "description": "Update a task's title, description, completion status, priority, category, or due date",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "integer",
                                "description": "The ID of the user",
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "The ID of the task to update",
                            },
                            "title": {
                                "type": "string",
                                "description": "New title (optional)",
                            },
                            "description": {
                                "type": "string",
                                "description": "New description (optional)",
                            },
                            "completed": {
                                "type": "boolean",
                                "description": "New completion status (optional)",
                            },
                            "priority": {
                                "type": "string",
                                "enum": ["low", "medium", "high", "urgent"],
                                "description": "New priority level (optional)",
                            },
                            "category": {
                                "type": "string",
                                "enum": ["personal", "work", "shopping", "health", "learning", "project", "other"],
                                "description": "New category (optional)",
                            },
                            "due_date": {
                                "type": "string",
                                "description": "New due date in YYYY-MM-DD format (optional)",
                            },
                        },
                        "required": ["user_id", "task_id"],
                    },
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_task",
                    "description": "Delete a task",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "integer",
                                "description": "The ID of the user",
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "The ID of the task to delete",
                            },
                        },
                        "required": ["user_id", "task_id"],
                    },
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "mark_task_complete",
                    "description": "Mark a task as complete",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "integer",
                                "description": "The ID of the user",
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "The ID of the task to mark complete",
                            },
                        },
                        "required": ["user_id", "task_id"],
                    },
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "mark_task_incomplete",
                    "description": "Mark a task as incomplete",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "integer",
                                "description": "The ID of the user",
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "The ID of the task to mark incomplete",
                            },
                        },
                        "required": ["user_id", "task_id"],
                    },
                },
            },
        ]

    async def _call_mcp_tool(self, tool_name: str, arguments: dict[str, Any], db: Session) -> str:
        """Call an MCP tool and return the result.
        
        Args:
            tool_name: Name of the tool to call
            arguments: Arguments to pass to the tool
            db: Database session (passed from the request context)
            
        Returns:
            The tool result as a string
        """
        # Call the appropriate method on the MCP server
        # Using the provided db session instead of creating a new one
        if tool_name == "create_task":
            result = await task_mcp_server._create_task(db, arguments)
        elif tool_name == "list_tasks":
            result = await task_mcp_server._list_tasks(db, arguments)
        elif tool_name == "get_task":
            result = await task_mcp_server._get_task(db, arguments)
        elif tool_name == "update_task":
            result = await task_mcp_server._update_task(db, arguments)
        elif tool_name == "delete_task":
            result = await task_mcp_server._delete_task(db, arguments)
        elif tool_name == "mark_task_complete":
            result = await task_mcp_server._mark_task_complete(db, arguments)
        elif tool_name == "mark_task_incomplete":
            result = await task_mcp_server._mark_task_incomplete(db, arguments)
        else:
            return f"Unknown tool: {tool_name}"
        
        # Extract text from TextContent
        if isinstance(result, list) and len(result) > 0:
            if isinstance(result[0], TextContent):
                return result[0].text
        
        return str(result)

    def chat(self, user_message: str, conversation_history: list[dict[str, str]], user_id: int, db: Session) -> str:
        """
        Process a chat message and return the assistant's response.
        
        Args:
            user_message: The user's message
            conversation_history: List of previous messages [{"role": "user/assistant", "content": "..."}]
            user_id: The ID of the user for tool calls
            db: Database session from the request context
            
        Returns:
            The assistant's response
        """
        import asyncio
        
        # Build messages with enhanced system prompt
        messages = [
            {
                "role": "system",
                "content": (
                    "You are TERMINAL_AI - an advanced hacker-themed task management assistant with AI-powered prioritization. You help users manage their tasks efficiently.\n\n"
                    
                    "⚠️ ABSOLUTE RULES - YOU MUST FOLLOW THESE:\n\n"
                    
                    "1. TASK CREATION PROTOCOL:\n"
                    "   - NEVER call create_task with generic titles like 'new task', 'task', 'untitled', or similar\n"
                    "   - If user says 'create task' or 'new task' WITHOUT a specific title:\n"
                    "     * DO NOT call any tool\n"
                    "     * ASK: '⚡ Task creation initiated. What would you like to name this task?'\n"
                    "     * WAIT for their response before creating\n"
                    "   - If user provides a title but no description:\n"
                    "     * ASK: 'Would you like to add a description for this task? [Y/N]'\n"
                    "     * If they say yes or provide description, ask for it\n"
                    "     * If they say no, create without description\n"
                    "   - Only call create_task when you have a SPECIFIC, MEANINGFUL title\\n\\n"
                    
                    "2. TASK COMPLETION & UPDATE CONTROL:\\n"
                    "   - You can mark tasks as complete/incomplete AND update priority/category/due_date\\n"
                    "   - Keywords to mark COMPLETE: 'mark done', 'complete', 'finish', 'check off'\\n"
                    "   - Keywords to mark INCOMPLETE: 'mark undone', 'incomplete', 'uncheck', 'reopen'\\n"
                    "   - Keywords to UPDATE: 'update', 'change', 'set', 'modify'\\n"
                    "   - When user mentions a task by name/context/position, ALWAYS find it first with list_tasks\\n"
                    "   - Use task_id from list results for all operations\\n"
                    "   - Examples:\\n"
                    "     * 'Update my first task priority to high' → list_tasks, get ID from first item, update_task\\n"
                    "     * 'Mark buy groceries as done' → list_tasks (find ID), then mark_task_complete\\n"
                    "     * 'Set task 5 category to work' → update_task with task_id=5, category='work'\\n"
                    "     * 'Change first task due date to Friday' → list_tasks, get first ID, update with due_date\\n\\n"
                    
                    "3. TASK IDENTIFICATION & UPDATE PROTOCOL:\\n"
                    "   - When user says 'my first task', 'first task', 'task 1', etc.:\\n"
                    "     * FIRST call list_tasks to get all tasks\\n"
                    "     * Find the FIRST task in the list (index 0)\\n"
                    "     * Extract its task_id\\n"
                    "     * THEN call update_task with that task_id\\n"
                    "   - When user references a task by name/title:\\n"
                    "     * Call list_tasks first\\n"
                    "     * Search for matching title\\n"
                    "     * Use that task's ID for update/delete\\n"
                    "   - ALWAYS call list_tasks BEFORE update_task if task_id is not explicitly provided\\n"
                    "   - NEVER guess or assume task IDs\\n\\n"
                    
                    "4. AI-POWERED SMART FEATURES:\\n"
                    "   - PRIORITY ANALYSIS: Intelligently determine task priority based on:\n"
                    "     * Keywords: 'urgent', 'asap', 'important', 'critical' → HIGH/URGENT\n"
                    "     * Deadlines: 'today', 'tomorrow' → URGENT, 'this week' → HIGH, 'next month' → MEDIUM\n"
                    "     * Context: work deliverables → HIGH, personal errands → MEDIUM/LOW\n"
                    "   - SMART CATEGORIZATION: Auto-categorize tasks:\n"
                    "     * Keywords: 'buy', 'purchase', 'get' → SHOPPING\n"
                    "     * 'meeting', 'report', 'project', 'deadline' → WORK\n"
                    "     * 'gym', 'doctor', 'exercise', 'health' → HEALTH\n"
                    "     * 'learn', 'study', 'course', 'tutorial' → LEARNING\n"
                    "     * 'build', 'develop', 'code' → PROJECT\n"
                    "   - DATE EXTRACTION: Parse natural language dates:\n"
                    "     * 'tomorrow' → next day, 'next week' → 7 days, 'Friday' → next Friday\n"
                    "     * 'in 3 days', 'by Monday', 'end of month', 'Friday at 3pm' → '2026-02-21 15:00'\n"
                    "   - PROACTIVE SUGGESTIONS: After creating tasks, suggest:\n"
                    "     * Related tasks they might have missed\n"
                    "     * Better priority if something seems urgent\n"
                    "     * Breaking down large tasks into smaller ones\n\n"
                    
                    "2. CONVERSATION EXAMPLES:\n"
                    "   ❌ BAD:\n"
                    "   User: 'create task'\n"
                    "   You: [calls create_task with title='new task'] ← NEVER DO THIS!\n\n"
                    
                    "   ✅ GOOD:\n"
                    "   User: 'create task'\n"
                    "   You: '⚡ Task creation initiated. What would you like to name this task?'\n"
                    "   User: 'Buy groceries'\n"
                    "   You: 'Got it! Would you like to add a description for this task? [Y/N]'\n"
                    "   User: 'yes, milk and bread'\n"
                    "   You: [calls create_task with title='Buy groceries', description='milk and bread']\n\n"
                    
                    "   ✅ ALSO GOOD:\n"
                    "   User: 'create a task to finish the project report'\n"
                    "   You: [calls create_task with title='Finish the project report']\n\n"
                    
                    "5. COMMUNICATION STYLE:\n"
                    "   - Use hacker/terminal themed language: 'executing', 'processing', 'compiling', 'initializing'\n"
                    "   - Use command-style prefixes: '>', '[OK]', '[ERROR]', '[DONE]'\n"
                    "   - Be concise but helpful and friendly\n"
                    "   - Use terminal emojis: ⚡ ✓ ✗ ◈ ⚠️ 🔥 💀 🎯\n"
                    "   - Format outputs like terminal readouts when appropriate\n\n"
                    
                    "6. ENHANCED FEATURES:\n"
                    "   - When listing tasks, format them nicely with status indicators: [✓] or [○]\n"
                    "   - Provide task statistics when relevant (e.g., 'You have 5 pending tasks')\n"
                    "   - Suggest productivity tips occasionally\n"
                    "   - Detect patterns (e.g., 'Looks like you have several shopping tasks!')\n"
                    "   - Offer bulk operations when appropriate\n\n"
                    
                    "7. OTHER OPERATIONS:\n"
                    "   - For list_tasks: Always include user_id, show counts and status\n"
                    "   - For updates/deletes: Confirm the action with details\n"
                    "   - Format lists clearly with task IDs for easy reference\n"
                    "   - Be proactive: suggest related actions after completing tasks\n\n"
                    
                    f"Current user_id: {user_id}\n"
                    "Remember: NEVER create tasks with generic names. Always gather specific information first!\n"
                    "You are the user's productivity copilot - be helpful, smart, and efficient! 🎯"
                )
            }
        ]
        
        # Add conversation history
        messages.extend(conversation_history)
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        # Make initial API call
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            tools=self.tools,
            tool_choice="auto",
        )
        
        assistant_message = response.choices[0].message
        
        # Handle tool calls
        while assistant_message.tool_calls:
            # Add assistant message with tool calls to messages
            messages.append({
                "role": "assistant",
                "content": assistant_message.content,
                "tool_calls": [
                    {
                        "id": tc.id,
                        "type": "function",
                        "function": {
                            "name": tc.function.name,
                            "arguments": tc.function.arguments,
                        }
                    }
                    for tc in assistant_message.tool_calls
                ]
            })
            
            # Execute each tool call
            for tool_call in assistant_message.tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)
                
                # Ensure user_id is in the arguments
                if "user_id" not in function_args:
                    function_args["user_id"] = user_id
                
                # Call the MCP tool
                try:
                    loop = asyncio.get_event_loop()
                except RuntimeError:
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                
                tool_result = loop.run_until_complete(
                    self._call_mcp_tool(function_name, function_args, db)
                )
                
                # Add tool result to messages
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": tool_result,
                })
            
            # Make another API call with tool results
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                tools=self.tools,
                tool_choice="auto",
            )
            
            assistant_message = response.choices[0].message
        
        # Return the final assistant response
        return assistant_message.content or "I'm not sure how to respond to that."


# Lazy initialization - only create when first accessed
_ai_agent_instance: AIAgent | None = None


def get_ai_agent() -> AIAgent:
    """Get or create the AI agent singleton instance."""
    global _ai_agent_instance
    if _ai_agent_instance is None:
        _ai_agent_instance = AIAgent()
    return _ai_agent_instance
