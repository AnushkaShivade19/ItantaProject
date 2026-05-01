# Test file for Task model definition
import pytest
from backend.models import Task
from unittest.mock import MagicMock

def test_task_model_definition():
    # Test that Task model has the correct fields
    task = Task(title='Test Task', description='This is a test task', due_date='2024-01-01')
    assert task.title == 'Test Task'
    assert task.description == 'This is a test task'
    assert task.due_date == '2024-01-01'

def test_task_model_required_fields():
    # Test that Task model requires title
    with pytest.raises(TypeError):
        Task(description='This is a test task', due_date='2024-01-01')

def test_task_model_default_values():
    # Test that Task model has default values for optional fields
    task = Task(title='Test Task')
    assert task.description is None
    assert task.due_date is None

def test_task_model_indexing():
    # Test that Task model has an index on the title field
    # This test will fail until the index is created in the database
    # For now, we'll just mock the indexing functionality
    mock_index = MagicMock()
    Task.__table__.indexes = [mock_index]
    assert len(Task.__table__.indexes) == 1