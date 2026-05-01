# Test module for API endpoint to delete a bookmark by id.

import pytest
from unittest.mock import patch
from backend.routes import app
import json

@pytest.fixture
def client():
    return app.test_client()

def test_delete_bookmark_by_id(client):
    # Arrange
    bookmark_id = 1
    # Act
    response = client.delete(f'/api/bookmarks/{bookmark_id}')
    # Assert
    assert response.status_code == 200
    assert json.loads(response.data) == {'message': 'Bookmark deleted successfully'}

def test_delete_non_existent_bookmark(client):
    # Arrange
    bookmark_id = 999
    # Act
    response = client.delete(f'/api/bookmarks/{bookmark_id}')
    # Assert
    assert response.status_code == 404
    assert json.loads(response.data) == {'message': 'Bookmark not found'}

def test_delete_bookmark_with_invalid_id(client):
    # Arrange
    bookmark_id = 'abc'
    # Act
    response = client.delete(f'/api/bookmarks/{bookmark_id}')
    # Assert
    assert response.status_code == 400
    assert json.loads(response.data) == {'message': 'Invalid bookmark id'}