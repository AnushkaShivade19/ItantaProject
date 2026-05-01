# Test API endpoints
# =================

import pytest
from backend.routes import app
from unittest.mock import patch
import json

@pytest.fixture
def client():
    return app.test_client()

def test_add_bookmark(client):
    # Test adding a new bookmark
    data = {'url': 'https://example.com', 'title': 'Example'}
    response = client.post('/api/bookmarks', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 200
    assert 'id' in response.json
    assert 'url' in response.json
    assert 'title' in response.json

def test_list_bookmarks(client):
    # Test listing all bookmarks
    response = client.get('/api/bookmarks')
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_delete_bookmark(client):
    # Test deleting a bookmark by id
    # First, add a new bookmark
    data = {'url': 'https://example.com', 'title': 'Example'}
    response = client.post('/api/bookmarks', data=json.dumps(data), content_type='application/json')
    bookmark_id = response.json['id']
    # Then, delete the bookmark
    response = client.delete(f'/api/bookmarks/{bookmark_id}')
    assert response.status_code == 200
    assert 'message' in response.json

def test_search_bookmarks(client):
    # Test searching bookmarks by keyword in title
    # First, add a new bookmark
    data = {'url': 'https://example.com', 'title': 'Example'}
    client.post('/api/bookmarks', data=json.dumps(data), content_type='application/json')
    # Then, search for the bookmark
    response = client.get('/api/bookmarks/search', query_string={'keyword': 'Example'})
    assert response.status_code == 200
    assert isinstance(response.json, list)