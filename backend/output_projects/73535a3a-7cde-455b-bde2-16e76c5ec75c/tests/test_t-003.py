# Test module for link schema validation
"""Tests for link schema validation"""

from backend.schemas.link import LinkSchema
import pytest
from unittest.mock import MagicMock

@pytest.fixture
def mock_link_schema():
    return LinkSchema()

def test_link_schema_validation_with_valid_data(mock_link_schema):
    # Test with valid data
    data = {
        'long_url': 'https://www.example.com',
        'alias': 'example',
        'expiration': '2024-01-01T00:00:00',
        'hits': 0
    }
    result = mock_link_schema.load(data)
    assert result == data

def test_link_schema_validation_with_invalid_data(mock_link_schema):
    # Test with invalid data
    data = {
        'long_url': '',
        'alias': '',
        'expiration': '',
        'hits': -1
    }
    with pytest.raises(Exception):
        mock_link_schema.load(data)

def test_link_schema_validation_with_missing_fields(mock_link_schema):
    # Test with missing fields
    data = {
        'long_url': 'https://www.example.com'
    }
    with pytest.raises(Exception):
        mock_link_schema.load(data)