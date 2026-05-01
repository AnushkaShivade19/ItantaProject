# Test the search API endpoint for case-insensitive search functionality.

import pytest
from unittest.mock import patch
from main import app
import json

@pytest.fixture
def client():
    return app.test_client()

def test_search_api_case_insensitive(client):
    # Add a bookmark with a title
    response = client.post('/api/bookmarks', data=json.dumps({'url': 'https://example.com', 'title': 'Example Title'}), content_type='application/json')
    assert response.status_code == 200

    # Search for the bookmark with a different case
    response = client.get('/api/bookmarks/search', query_string={'keyword': 'example'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 1
    assert data[0]['title'] == 'Example Title'

def test_search_api_case_insensitive_no_match(client):
    # Add a bookmark with a title
    response = client.post('/api/bookmarks', data=json.dumps({'url': 'https://example.com', 'title': 'Example Title'}), content_type='application/json')
    assert response.status_code == 200

    # Search for a non-existent keyword
    response = client.get('/api/bookmarks/search', query_string={'keyword': 'non-existent'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 0

def test_search_api_case_insensitive_multiple_bookmarks(client):
    # Add multiple bookmarks with different titles
    response = client.post('/api/bookmarks', data=json.dumps({'url': 'https://example1.com', 'title': 'Example Title 1'}), content_type='application/json')
    assert response.status_code == 200
    response = client.post('/api/bookmarks', data=json.dumps({'url': 'https://example2.com', 'title': 'Example Title 2'}), content_type='application/json')
    assert response.status_code == 200

    # Search for a keyword that matches multiple bookmarks
    response = client.get('/api/bookmarks/search', query_string={'keyword': 'example'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 2