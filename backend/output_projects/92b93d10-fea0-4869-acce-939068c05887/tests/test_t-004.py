# Test the API endpoint for listing bookmarks

import pytest
from backend.routes import app
from unittest.mock import patch
import json

@pytest.fixture
def client():
    return app.test_client()

def test_list_bookmarks_happy_path(client):
    # Mock the database query to return a list of bookmarks
    with patch('database.get_all_bookmarks') as mock_get_all_bookmarks:
        mock_get_all_bookmarks.return_value = [
            {'id': 1, 'url': 'https://example.com', 'title': 'Example Bookmark'},
            {'id': 2, 'url': 'https://example2.com', 'title': 'Example Bookmark 2'}
        ]
        response = client.get('/api/bookmarks')
        assert response.status_code == 200
        assert len(response.json) == 2

def test_list_bookmarks_empty_database(client):
    # Mock the database query to return an empty list
    with patch('database.get_all_bookmarks') as mock_get_all_bookmarks:
        mock_get_all_bookmarks.return_value = []
        response = client.get('/api/bookmarks')
        assert response.status_code == 200
        assert len(response.json) == 0

def test_list_bookmarks_internal_server_error(client):
    # Mock the database query to raise an exception
    with patch('database.get_all_bookmarks') as mock_get_all_bookmarks:
        mock_get_all_bookmarks.side_effect = Exception('Mocked database error')
        response = client.get('/api/bookmarks')
        assert response.status_code == 500