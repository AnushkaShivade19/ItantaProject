# Test the API endpoint for adding bookmarks

import pytest
from unittest.mock import patch
from backend.routes import app
import json

@pytest.fixture
def client():
    return app.test_client()

def test_add_bookmark_happy_path(client):
    # Mock the database connection
    with patch('database.connect') as mock_connect:
        # Create a test bookmark
        bookmark = {'url': 'https://example.com', 'title': 'Example Bookmark'}
        # Send a POST request to the API endpoint
        response = client.post('/api/bookmarks', data=json.dumps(bookmark), content_type='application/json')
        # Assert that the response is successful
        assert response.status_code == 201
        # Assert that the response contains the added bookmark
        assert response.json['url'] == bookmark['url']
        assert response.json['title'] == bookmark['title']

def test_add_bookmark_invalid_request(client):
    # Send a POST request with an invalid JSON body
    response = client.post('/api/bookmarks', data='Invalid JSON', content_type='application/json')
    # Assert that the response is an error
    assert response.status_code == 400

def test_add_bookmark_missing_fields(client):
    # Create a test bookmark with missing fields
    bookmark = {'url': 'https://example.com'}
    # Send a POST request to the API endpoint
    response = client.post('/api/bookmarks', data=json.dumps(bookmark), content_type='application/json')
    # Assert that the response is an error
    assert response.status_code == 400