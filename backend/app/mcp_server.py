"""MCP Server for task management operations."""

from typing import Any
from mcp.server import Server
from mcp.types import Tool, TextContent
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import SessionLocal
from app.models.task import Task


class TaskMCPServer:
    """MCP Server that exposes task management tools."""

    def __init__(self):
        self.server = Server("task-manager")
        self._register_tools()

    def _register_tools(self):
        """Register all MCP tools."""

        @self.server.list_tools()
        async def list_tools() -> list[Tool]:
            """List available task management tools."""
            return [
                Tool(
                    name="create_task",
                    description="Create a new task for the user",
                    inputSchema={
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
                        },
                        "required": ["user_id", "title"],
                    },
                ),
                Tool(
                    name="list_tasks",
                    description="List all tasks for a user, optionally filtered by completion status",
                    inputSchema={
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
                ),
                Tool(
                    name="get_task",
                    description="Get details of a specific task",
                    inputSchema={
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
                ),
                Tool(
                    name="update_task",
                    description="Update a task's title, description, or completion status",
                    inputSchema={
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
                        },
                        "required": ["user_id", "task_id"],
                    },
                ),
                Tool(
                    name="delete_task",
                    description="Delete a task",
                    inputSchema={
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
                ),
                Tool(
                    name="mark_task_complete",
                    description="Mark a task as complete",
                    inputSchema={
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
                ),
                Tool(
                    name="mark_task_incomplete",
                    description="Mark a task as incomplete",
                    inputSchema={
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
                ),
            ]

        @self.server.call_tool()
        async def call_tool(name: str, arguments: dict[str, Any]) -> list[TextContent]:
            """Handle tool calls."""
            db = SessionLocal()
            try:
                if name == "create_task":
                    return await self._create_task(db, arguments)
                elif name == "list_tasks":
                    return await self._list_tasks(db, arguments)
                elif name == "get_task":
                    return await self._get_task(db, arguments)
                elif name == "update_task":
                    return await self._update_task(db, arguments)
                elif name == "delete_task":
                    return await self._delete_task(db, arguments)
                elif name == "mark_task_complete":
                    return await self._mark_task_complete(db, arguments)
                elif name == "mark_task_incomplete":
                    return await self._mark_task_incomplete(db, arguments)
                else:
                    return [TextContent(type="text", text=f"Unknown tool: {name}")]
            finally:
                db.close()

    async def _create_task(
        self, db: Session, arguments: dict[str, Any]
    ) -> list[TextContent]:
        """Create a new task."""
        user_id = arguments["user_id"]
        title = arguments["title"]
        description = arguments.get("description", "")

        task = Task(
            user_id=user_id,
            title=title,
            description=description,
            completed=False,
        )
        db.add(task)
        db.commit()
        db.refresh(task)

        return [
            TextContent(
                type="text",
                text=f"Task created successfully! ID: {task.id}, Title: {task.title}",
            )
        ]

    async def _list_tasks(
        self, db: Session, arguments: dict[str, Any]
    ) -> list[TextContent]:
        """List all tasks for a user."""
        user_id = arguments["user_id"]
        completed = arguments.get("completed")

        query = db.query(Task).filter(Task.user_id == user_id)
        if completed is not None:
            query = query.filter(Task.completed == completed)

        tasks = query.order_by(Task.created_at.desc()).all()

        if not tasks:
            return [TextContent(type="text", text="No tasks found.")]

        task_list = []
        for task in tasks:
            status = "✓" if task.completed else "○"
            task_list.append(
                f"{status} [{task.id}] {task.title}"
                + (f" - {task.description}" if task.description else "")
            )

        return [TextContent(type="text", text="\n".join(task_list))]

    async def _get_task(
        self, db: Session, arguments: dict[str, Any]
    ) -> list[TextContent]:
        """Get details of a specific task."""
        user_id = arguments["user_id"]
        task_id = arguments["task_id"]

        task = (
            db.query(Task)
            .filter(Task.id == task_id, Task.user_id == user_id)
            .first()
        )

        if not task:
            return [TextContent(type="text", text="Task not found.")]

        status = "Complete" if task.completed else "Incomplete"
        text = f"Task ID: {task.id}\nTitle: {task.title}\nDescription: {task.description}\nStatus: {status}\nCreated: {task.created_at}"

        return [TextContent(type="text", text=text)]

    async def _update_task(
        self, db: Session, arguments: dict[str, Any]
    ) -> list[TextContent]:
        """Update a task."""
        user_id = arguments["user_id"]
        task_id = arguments["task_id"]

        task = (
            db.query(Task)
            .filter(Task.id == task_id, Task.user_id == user_id)
            .first()
        )

        if not task:
            return [TextContent(type="text", text="Task not found.")]

        if "title" in arguments:
            task.title = arguments["title"]
        if "description" in arguments:
            task.description = arguments["description"]
        if "completed" in arguments:
            task.completed = arguments["completed"]

        task.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(task)

        return [
            TextContent(
                type="text", text=f"Task {task.id} updated successfully!"
            )
        ]

    async def _delete_task(
        self, db: Session, arguments: dict[str, Any]
    ) -> list[TextContent]:
        """Delete a task."""
        user_id = arguments["user_id"]
        task_id = arguments["task_id"]

        task = (
            db.query(Task)
            .filter(Task.id == task_id, Task.user_id == user_id)
            .first()
        )

        if not task:
            return [TextContent(type="text", text="Task not found.")]

        title = task.title
        db.delete(task)
        db.commit()

        return [
            TextContent(
                type="text", text=f"Task '{title}' deleted successfully!"
            )
        ]

    async def _mark_task_complete(
        self, db: Session, arguments: dict[str, Any]
    ) -> list[TextContent]:
        """Mark a task as complete."""
        user_id = arguments["user_id"]
        task_id = arguments["task_id"]

        task = (
            db.query(Task)
            .filter(Task.id == task_id, Task.user_id == user_id)
            .first()
        )

        if not task:
            return [TextContent(type="text", text="Task not found.")]

        task.completed = True
        task.updated_at = datetime.utcnow()
        db.commit()

        return [
            TextContent(
                type="text", text=f"Task '{task.title}' marked as complete! ✓"
            )
        ]

    async def _mark_task_incomplete(
        self, db: Session, arguments: dict[str, Any]
    ) -> list[TextContent]:
        """Mark a task as incomplete."""
        user_id = arguments["user_id"]
        task_id = arguments["task_id"]

        task = (
            db.query(Task)
            .filter(Task.id == task_id, Task.user_id == user_id)
            .first()
        )

        if not task:
            return [TextContent(type="text", text="Task not found.")]

        task.completed = False
        task.updated_at = datetime.utcnow()
        db.commit()

        return [
            TextContent(
                type="text", text=f"Task '{task.title}' marked as incomplete."
            )
        ]


# Create singleton instance
task_mcp_server = TaskMCPServer()
