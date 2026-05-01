# Test module for API tests
"""Tests for the API endpoints"""

import pytest
from unittest.mock import patch, MagicMock
from links import create_short_url, get_link, get_link_stats

@pytest.fixture
def mock_db():
    with patch('links.db') as mock_db:
        yield mock_db

def test_create_short_url(mock_db):
    # Test creating a shortened URL
    long_url = 'https://example.com'
    alias = 'example'
    response = create_short_url(long_url, alias)
    assert response['id'] is not None
    assert response['alias'] == alias
    assert response['short_url'] is not None

def test_create_short_url_without_alias(mock_db):
    # Test creating a shortened URL without an alias
    long_url = 'https://example.com'
    response = create_short_url(long_url)
    assert response['id'] is not None
    assert response['alias'] is not None
    assert response['short_url'] is not None

def test_get_link(mock_db):
    # Test getting a link by alias
    alias = 'example'
    response = get_link(alias)
    assert response['id'] is not None
    assert response['long_url'] is not None
    assert response['hit_count'] is not None

def test_get_link_stats(mock_db):
    # Test getting link stats by alias
    alias = 'example'
    response = get_link_stats(alias)
    assert response['id'] is not None
    assert response['long_url'] is not None
    assert response['hit_count'] is not None
    assert response['created_at'] is not None