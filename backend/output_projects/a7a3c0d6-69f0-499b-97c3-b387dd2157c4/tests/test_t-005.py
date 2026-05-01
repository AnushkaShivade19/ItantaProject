# Test module for hit-count analytics functionality

import pytest
from unittest.mock import patch
from url_shortener.backend.analytics import get_hit_count

@pytest.fixture
def mock_db():
    with patch('url_shortener.backend.analytics.db') as mock_db:
        yield mock_db

def test_get_hit_count_happy_path(mock_db):
    # Arrange
    alias = 'test-alias'
    expected_hit_count = 10
    mock_db.get_hit_count.return_value = expected_hit_count

    # Act
    hit_count = get_hit_count(alias)

    # Assert
    assert hit_count == expected_hit_count
    mock_db.get_hit_count.assert_called_once_with(alias)

def test_get_hit_count_edge_case_alias_not_found(mock_db):
    # Arrange
    alias = 'non-existent-alias'
    mock_db.get_hit_count.side_effect = ValueError('Alias not found')

    # Act and Assert
    with pytest.raises(ValueError):
        get_hit_count(alias)

def test_get_hit_count_edge_case_db_error(mock_db):
    # Arrange
    alias = 'test-alias'
    mock_db.get_hit_count.side_effect = Exception('DB error')

    # Act and Assert
    with pytest.raises(Exception):
        get_hit_count(alias)