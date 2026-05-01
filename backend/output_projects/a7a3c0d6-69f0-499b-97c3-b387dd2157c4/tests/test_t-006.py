# Test API request/response schemas implementation
"""Tests for API request/response schemas"""

import pytest
from unittest.mock import MagicMock
from url_shortener.backend.schemas import CreateLinkSchema, LinkSchema, LinkStatsSchema

@pytest.fixture
def mock_request():
    return MagicMock()

@pytest.fixture
def mock_response():
    return MagicMock()

def test_create_link_schema_valid_data(mock_request):
    # Test CreateLinkSchema with valid data
    data = {'long_url': 'https://example.com', 'alias': 'example'}
    schema = CreateLinkSchema()
    result = schema.load(data)
    assert result == data

def test_create_link_schema_invalid_data(mock_request):
    # Test CreateLinkSchema with invalid data
    data = {'long_url': 'invalid', 'alias': 'example'}
    schema = CreateLinkSchema()
    with pytest.raises(Exception):
        schema.load(data)

def test_link_schema_valid_data(mock_response):
    # Test LinkSchema with valid data
    data = {'id': '123e4567-e89b-12d3-a456-426614174000', 'alias': 'example', 'short_url': 'https://example.com'}
    schema = LinkSchema()
    result = schema.dump(data)
    assert result == data

def test_link_stats_schema_valid_data(mock_response):
    # Test LinkStatsSchema with valid data
    data = {'id': '123e4567-e89b-12d3-a456-426614174000', 'long_url': 'https://example.com', 'hit_count': 10, 'created_at': '2022-01-01T00:00:00'}
    schema = LinkStatsSchema()
    result = schema.dump(data)
    assert result == data