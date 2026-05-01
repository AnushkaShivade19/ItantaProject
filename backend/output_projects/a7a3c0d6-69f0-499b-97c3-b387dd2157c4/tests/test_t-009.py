# Test module for API error handling functionality

import pytest
from unittest.mock import patch
from url_shortener.backend.main import app
import json

@pytest.fixture
def client():
    return app.test_client()

def test_api_error_handling_for_invalid_request(client):
    # Test error handling for invalid request
    response = client.post('/api/links', data=json.dumps({}), content_type='application/json')
    assert response.status_code == 400
    assert 'error' in response.json

def test_api_error_handling_for_non_existent_alias(client):
    # Test error handling for non-existent alias
    response = client.get('/api/links/non_existent_alias')
    assert response.status_code == 404
    assert 'error' in response.json

def test_api_error_handling_for_invalid_alias(client):
    # Test error handling for invalid alias
    response = client.get('/api/links/invalid_alias')
    assert response.status_code == 400
    assert 'error' in response.json

def test_api_error_handling_for_internal_server_error(client, monkeypatch):
    # Test error handling for internal server error
    with patch('url_shortener.backend.main.get_link', side_effect=Exception('Internal Server Error')):
        response = client.get('/api/links/existing_alias')
        assert response.status_code == 500
        assert 'error' in response.json