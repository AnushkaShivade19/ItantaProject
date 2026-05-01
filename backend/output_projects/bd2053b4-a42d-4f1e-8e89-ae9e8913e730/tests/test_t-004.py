# Test module for listing bookmarks API endpoint
import pytest
import json
from unittest.mock import patch
from main import app

@pytest.fixture
def client():
    return app.test_client()

def test_list_bookmarks_happy_path(client):
    # Mock database query to return a list of bookmarks
    with patch('main.get_bookmarks') as mock_get_bookmarks:
        mock_get_bookmarks.return_value = [
            {'id': 1, 'url': 'https://example.com', 'title': 'Example'},
            {'id': 2, 'url': 'https://example2.com', 'title': 'Example 2'}
        ]
        response = client.get('/api/bookmarks')
        assert response.status_code == 200
        assert len(response.json) == 2
        assert response.json[0]['id'] == 1
        assert response.json[0]['url'] == 'https://example.com'
        assert response.json[0]['title'] == 'Example'

def test_list_bookmarks_empty_list(client):
    # Mock database query to return an empty list
    with patch('main.get_bookmarks') as mock_get_bookmarks:
        mock_get_bookmarks.return_value = []
        response = client.get('/api/bookmarks')
        assert response.status_code == 200
        assert len(response.json) == 0

def test_list_bookmarks_internal_server_error(client):
    # Mock database query to raise an exception
    with patch('main.get_bookmarks') as mock_get_bookmarks:
        mock_get_bookmarks.side_effect = Exception('Mocked exception')
        response = client.get('/api/bookmarks')
        assert response.status_code == 500