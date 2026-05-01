# Test the API endpoint for deleting bookmarks

import pytest
import json
from unittest.mock import patch
from main import app

@pytest.fixture
def client():
    return app.test_client()

def test_delete_bookmark_success(client):
    # Mock the database to return a bookmark
    with patch('main.bookmark.delete') as mock_delete:
        mock_delete.return_value = True
        response = client.delete('/api/bookmarks/1')
        assert response.status_code == 200
        assert json.loads(response.data) == {'message': 'Bookmark deleted successfully'}

def test_delete_bookmark_failure(client):
    # Mock the database to return an error
    with patch('main.bookmark.delete') as mock_delete:
        mock_delete.return_value = False
        response = client.delete('/api/bookmarks/1')
        assert response.status_code == 404
        assert json.loads(response.data) == {'message': 'Bookmark not found'}

def test_delete_bookmark_invalid_id(client):
    # Test with an invalid id
    response = client.delete('/api/bookmarks/abc')
    assert response.status_code == 400
    assert json.loads(response.data) == {'message': 'Invalid id'}