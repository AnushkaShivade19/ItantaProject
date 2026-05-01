# Test the API entrypoint implementation
import pytest
from fastapi.testclient import TestClient
from url_shortener.backend.main import app

@pytest.fixture
def client():
    return TestClient(app)

def test_create_shortened_url(client):
    # Test creating a shortened URL
    response = client.post('/api/links', json={'long_url': 'https://example.com', 'alias': 'example'})
    assert response.status_code == 201
    assert 'id' in response.json()
    assert 'alias' in response.json()
    assert 'short_url' in response.json()

def test_redirect_to_original_link(client):
    # Test redirecting to the original link
    response = client.post('/api/links', json={'long_url': 'https://example.com', 'alias': 'example'})
    alias = response.json()['alias']
    response = client.get(f'/api/links/{alias}')
    assert response.status_code == 200
    assert 'id' in response.json()
    assert 'long_url' in response.json()
    assert 'hit_count' in response.json()

def test_retrieve_hit_count_analytics(client):
    # Test retrieving hit-count analytics
    response = client.post('/api/links', json={'long_url': 'https://example.com', 'alias': 'example'})
    alias = response.json()['alias']
    response = client.get(f'/api/links/{alias}/stats')
    assert response.status_code == 200
    assert 'id' in response.json()
    assert 'long_url' in response.json()
    assert 'hit_count' in response.json()
    assert 'created_at' in response.json()