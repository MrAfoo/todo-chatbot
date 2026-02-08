"""Tests for task endpoints."""

import pytest


def test_create_task(client, test_user):
    """Test creating a new task."""
    response = client.post(
        f"/api/{test_user['user']['id']}/tasks",
        json={"title": "Test Task", "description": "Test Description"},
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["description"] == "Test Description"
    assert data["completed"] is False
    assert data["user_id"] == test_user["user"]["id"]


def test_get_all_tasks(client, test_user):
    """Test getting all tasks for a user."""
    # Create two tasks
    client.post(
        f"/api/{test_user['user']['id']}/tasks",
        json={"title": "Task 1", "description": "Description 1"},
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    client.post(
        f"/api/{test_user['user']['id']}/tasks",
        json={"title": "Task 2", "description": "Description 2"},
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )

    # Get all tasks
    response = client.get(
        f"/api/{test_user['user']['id']}/tasks",
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["title"] == "Task 1"
    assert data[1]["title"] == "Task 2"


def test_get_task_by_id(client, test_user):
    """Test getting a specific task by ID."""
    # Create a task
    create_response = client.post(
        f"/api/{test_user['user']['id']}/tasks",
        json={"title": "Test Task", "description": "Test Description"},
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    task_id = create_response.json()["id"]

    # Get the task
    response = client.get(
        f"/api/{test_user['user']['id']}/tasks/{task_id}",
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == task_id
    assert data["title"] == "Test Task"


def test_update_task(client, test_user):
    """Test updating a task."""
    # Create a task
    create_response = client.post(
        f"/api/{test_user['user']['id']}/tasks",
        json={"title": "Original Title", "description": "Original Description"},
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    task_id = create_response.json()["id"]

    # Update the task
    response = client.put(
        f"/api/{test_user['user']['id']}/tasks/{task_id}",
        json={
            "title": "Updated Title",
            "description": "Updated Description",
            "completed": True,
        },
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["description"] == "Updated Description"
    assert data["completed"] is True


def test_delete_task(client, test_user):
    """Test deleting a task."""
    # Create a task
    create_response = client.post(
        f"/api/{test_user['user']['id']}/tasks",
        json={"title": "Task to Delete", "description": "Will be deleted"},
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    task_id = create_response.json()["id"]

    # Delete the task
    response = client.delete(
        f"/api/{test_user['user']['id']}/tasks/{task_id}",
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    assert response.status_code == 204

    # Verify task is deleted
    get_response = client.get(
        f"/api/{test_user['user']['id']}/tasks/{task_id}",
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    assert get_response.status_code == 404


def test_unauthorized_access(client, test_user):
    """Test accessing tasks without authentication."""
    response = client.get(f"/api/{test_user['user']['id']}/tasks")
    assert response.status_code == 401


def test_forbidden_access_other_user_tasks(client, test_user):
    """Test accessing another user's tasks."""
    # Try to access user ID that doesn't match the authenticated user
    response = client.get(
        f"/api/{test_user['user']['id'] + 999}/tasks",
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    assert response.status_code == 403


def test_create_task_with_priority_and_category(client, test_user):
    """Test creating tasks with different priority and category values."""
    test_cases = [
        {"priority": "LOW", "category": "PERSONAL"},
        {"priority": "MEDIUM", "category": "WORK"},
        {"priority": "HIGH", "category": "SHOPPING"},
        {"priority": "URGENT", "category": "LEARNING"},
    ]
    
    for test_case in test_cases:
        response = client.post(
            f"/api/{test_user['user']['id']}/tasks",
            json={
                "title": f"Test {test_case['priority']} Task",
                "description": f"Testing {test_case['priority']} priority",
                "priority": test_case["priority"],
                "category": test_case["category"],
            },
            headers={"Authorization": f"Bearer {test_user['token']}"},
        )
        assert response.status_code == 201
        data = response.json()
        
        # Verify priority and category are returned correctly
        assert data["priority"] == test_case["priority"], \
            f"Expected priority {test_case['priority']}, got {data.get('priority')}"
        assert data["category"] == test_case["category"], \
            f"Expected category {test_case['category']}, got {data.get('category')}"
        assert "priority" in data, "Priority field missing in response"
        assert "category" in data, "Category field missing in response"


def test_update_task_priority_and_category(client, test_user):
    """Test updating task priority and category."""
    # Create a task with default values
    create_response = client.post(
        f"/api/{test_user['user']['id']}/tasks",
        json={"title": "Task to Update", "description": "Will be updated"},
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]
    
    # Update priority and category
    update_response = client.put(
        f"/api/{test_user['user']['id']}/tasks/{task_id}",
        json={
            "priority": "URGENT",
            "category": "WORK",
        },
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["priority"] == "URGENT"
    assert data["category"] == "WORK"
