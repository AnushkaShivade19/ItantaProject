# Test API routes implementation
import pytest
from unittest.mock import patch, MagicMock
from url_shortener.backend.routes import app
import json

@pytest.fixture
def client():
    return app.test_client()

def test_create_shortened_url(client):
    # Test creating a shortened URL
    data = {'long_url': 'https://example.com', 'alias': 'example'}
    response = client.post('/api/links', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 201
    assert 'id' in response.json
    assert 'alias' in response.json
    assert 'short_url' in response.json

def test_redirect_to_original_link(client):
    # Test redirecting to the original link
    with patch('url_shortener.backend.routes.links.get_link') as mock_get_link:
        mock_link = MagicMock(id='123e4567-e89b-12d3-a456-426655440000', long_url='https://example.com', hit_count=0)
        mock_get_link.return_value = mock_link
        response = client.get('/api/links/example')
        assert response.status_code == 302
        assert response.headers['Location'] == 'https://example.com'

def test_retrieve_hit_count_analytics(client):
    # Test retrieving hit-count analytics
    with patch('url_shortener.backend.routes.links.get_link') as mock_get_link:
        mock_link = MagicMock(id='123e4567-e89b-12d3-a456-426655440000', long_url='https://example.com', hit_count=10, created_at='2022-01-01 12:00:00')
        mock_get_link.return_value = mock_link
        response = client.get('/api/links/example/stats')
        assert response.status_code == 200
        assert 'id' in response.json
        assert 'long_url' in response.json
        assert 'hit_count' in response.json
        assert 'created_at' in response.json