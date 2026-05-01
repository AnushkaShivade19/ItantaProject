# Test module for link routes
# This module tests the creation, retrieval, and deletion of links through routes.

import pytest
from unittest.mock import patch, MagicMock
from backend.routes.links import create_link, get_link, delete_link

@pytest.fixture
def mock_database():
    with patch('backend.database') as mock_db:
        yield mock_db

def test_create_link(mock_database):
    # Test successful link creation
    long_url = 'https://example.com'
    alias = 'example'
    expiration = '2024-01-01'
    response = create_link(long_url, alias, expiration)
    assert response.status_code == 201
    assert response.json()['alias'] == alias

def test_get_link(mock_database):
    # Test successful link retrieval
    alias = 'example'
    response = get_link(alias)
    assert response.status_code == 200
    assert response.json()['alias'] == alias

def test_delete_link(mock_database):
    # Test successful link deletion
    alias = 'example'
    response = delete_link(alias)
    assert response.status_code == 204

def test_create_link_invalid_request(mock_database):
    # Test link creation with invalid request data
    long_url = None
    alias = 'example'
    expiration = '2024-01-01'
    response = create_link(long_url, alias, expiration)
    assert response.status_code == 400

def test_get_link_not_found(mock_database):
    # Test link retrieval with non-existent alias
    alias = 'non-existent'
    response = get_link(alias)
    assert response.status_code == 404