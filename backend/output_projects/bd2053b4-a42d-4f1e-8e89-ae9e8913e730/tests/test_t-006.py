# Test the API endpoint for searching bookmarks
"""Tests for the /api/bookmarks/search endpoint"""

import pytest
from main import app
from unittest.mock import patch
import json

@pytest.fixture
def client():
    return app.test_client()

def test_search_bookmarks_by_keyword(client):
    # Mock the database query to return some bookmarks
    with patch('main.bookmark.get_bookmarks_by_keyword') as mock_get_bookmarks:
        mock_get_bookmarks.return_value = [
            {'id': 1, 'url': 'https://example.com', 'title': 'Example Bookmark'},
            {'id': 2, 'url': 'https://example2.com', 'title': 'Another Example Bookmark'}
        ]
        
        # Send a GET request to the /api/bookmarks/search endpoint
        response = client.get('/api/bookmarks/search?keyword=example')
        
        # Check that the response is successful
        assert response.status_code == 200
        
        # Check that the response contains the expected bookmarks
        expected_response = [
            {'id': 1, 'url': 'https://example.com', 'title': 'Example Bookmark'},
            {'id': 2, 'url': 'https://example2.com', 'title': 'Another Example Bookmark'}
        ]
        assert json.loads(response.data) == expected_response

def test_search_bookmarks_by_keyword_no_results(client):
    # Mock the database query to return no bookmarks
    with patch('main.bookmark.get_bookmarks_by_keyword') as mock_get_bookmarks:
        mock_get_bookmarks.return_value = []
        
        # Send a GET request to the /api/bookmarks/search endpoint
        response = client.get('/api/bookmarks/search?keyword=nonexistent')
        
        # Check that the response is successful
        assert response.status_code == 200
        
        # Check that the response contains an empty list
        assert json.loads(response.data) == []

def test_search_bookmarks_by_keyword_invalid_keyword(client):
    # Send a GET request to the /api/bookmarks/search endpoint with an invalid keyword
    response = client.get('/api/bookmarks/search?keyword=')
    
    # Check that the response is successful
    assert response.status_code == 200
    
    # Check that the response contains an empty list
    assert json.loads(response.data) == []