# Test the API endpoint for adding bookmarks
"""Tests for the API endpoint to add new bookmarks."""

import pytest
from main import app
from unittest.mock import patch
import json

@pytest.fixture
def client():
    return app.test_client()

def test_add_bookmark_happy_path(client):
    # Mock the database interaction
    with patch('main.bookmark.add_bookmark') as mock_add_bookmark:
        mock_add_bookmark.return_value = {'id': 1, 'url': 'https://example.com', 'title': 'Example'}
        response = client.post('/api/bookmarks', data=json.dumps({'url': 'https://example.com', 'title': 'Example'}), content_type='application/json')
        assert response.status_code == 200
        assert response.json == {'id': 1, 'url': 'https://example.com', 'title': 'Example'}

def test_add_bookmark_invalid_request(client):
    # Test with invalid request data
    response = client.post('/api/bookmarks', data=json.dumps({'invalid': 'data'}), content_type='application/json')
    assert response.status_code == 400

def test_add_bookmark_database_error(client):
    # Mock the database interaction to raise an error
    with patch('main.bookmark.add_bookmark') as mock_add_bookmark:
        mock_add_bookmark.side_effect = Exception('Database error')
        response = client.post('/api/bookmarks', data=json.dumps({'url': 'https://example.com', 'title': 'Example'}), content_type='application/json')
        assert response.status_code == 500