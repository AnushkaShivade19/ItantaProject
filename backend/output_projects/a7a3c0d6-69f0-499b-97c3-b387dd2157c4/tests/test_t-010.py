# Test API performance optimization functionality
"""Tests for API performance optimization"""

import pytest
from unittest.mock import patch
from url_shortener.backend.main import app
import json

@pytest.fixture
def client():
    return app.test_client()

def test_api_performance_optimization_happy_path(client):
    # Mock the database query to return a shortened URL
    with patch('url_shortener.backend.main.links.get_link') as mock_get_link:
        mock_get_link.return_value = {'id': '123e4567-e89b-12d3-a456-426655440000', 'long_url': 'https://www.example.com', 'hit_count': 0}
        response = client.get('/api/links/test-alias')
        assert response.status_code == 200
        assert json.loads(response.data) == {'id': '123e4567-e89b-12d3-a456-426655440000', 'long_url': 'https://www.example.com', 'hit_count': 1}

def test_api_performance_optimization_edge_case(client):
    # Mock the database query to return None
    with patch('url_shortener.backend.main.links.get_link') as mock_get_link:
        mock_get_link.return_value = None
        response = client.get('/api/links/test-alias')
        assert response.status_code == 404

def test_api_performance_optimization_stats(client):
    # Mock the database query to return a shortened URL with stats
    with patch('url_shortener.backend.main.links.get_link_stats') as mock_get_link_stats:
        mock_get_link_stats.return_value = {'id': '123e4567-e89b-12d3-a456-426655440000', 'long_url': 'https://www.example.com', 'hit_count': 10, 'created_at': '2022-01-01 12:00:00'}
        response = client.get('/api/links/test-alias/stats')
        assert response.status_code == 200
        assert json.loads(response.data) == {'id': '123e4567-e89b-12d3-a456-426655440000', 'long_url': 'https://www.example.com', 'hit_count': 10, 'created_at': '2022-01-01 12:00:00'}