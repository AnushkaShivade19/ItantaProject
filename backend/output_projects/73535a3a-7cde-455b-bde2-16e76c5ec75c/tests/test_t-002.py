# Test module for link model creation
"""Tests for link model creation with valid data"""

from backend.models.link import Link
import pytest
from unittest.mock import MagicMock

@pytest.fixture
def mock_database():
    return MagicMock()

def test_create_link_with_valid_data(mock_database):
    # Arrange
    long_url = 'https://www.example.com'
    alias = 'example'
    expiration = None
    hits = 0

    # Act
    link = Link(long_url, alias, expiration, hits)

    # Assert
    assert link.long_url == long_url
    assert link.alias == alias
    assert link.expiration == expiration
    assert link.hits == hits

def test_create_link_with_expiration(mock_database):
    # Arrange
    long_url = 'https://www.example.com'
    alias = 'example'
    expiration = '2024-01-01 00:00:00'
    hits = 0

    # Act
    link = Link(long_url, alias, expiration, hits)

    # Assert
    assert link.long_url == long_url
    assert link.alias == alias
    assert link.expiration == expiration
    assert link.hits == hits

def test_create_link_without_alias(mock_database):
    # Arrange
    long_url = 'https://www.example.com'
    alias = None
    expiration = None
    hits = 0

    # Act and Assert
    with pytest.raises(ValueError):
        Link(long_url, alias, expiration, hits)