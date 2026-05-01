# Test module for analytics functionality

import pytest
from unittest.mock import patch, MagicMock
from backend.routes.analytics import get_analytics_for_link, get_analytics_for_all_links
from backend.utils.database import DatabaseConnection

@pytest.fixture
def mock_database_connection():
    with patch('backend.utils.database.DatabaseConnection') as mock_db:
        yield mock_db

def test_get_analytics_for_link_success(mock_database_connection):
    # Arrange
    link_alias = 'test-alias'
    start_date = '2022-01-01'
    end_date = '2022-01-31'
    expected_result = {'id': 'test-id', 'alias': link_alias, 'hits': 10}

    mock_db = mock_database_connection()
    mock_db.query.return_value = [{'id': 'test-id', 'alias': link_alias, 'hits': 10}]

    # Act
    result = get_analytics_for_link(link_alias, start_date, end_date)

    # Assert
    assert result == expected_result

def test_get_analytics_for_link_no_data(mock_database_connection):
    # Arrange
    link_alias = 'test-alias'
    start_date = '2022-01-01'
    end_date = '2022-01-31'
    expected_result = None

    mock_db = mock_database_connection()
    mock_db.query.return_value = []

    # Act
    result = get_analytics_for_link(link_alias, start_date, end_date)

    # Assert
    assert result == expected_result

def test_get_analytics_for_all_links_success(mock_database_connection):
    # Arrange
    start_date = '2022-01-01'
    end_date = '2022-01-31'
    expected_result = [{'id': 'test-id-1', 'alias': 'test-alias-1', 'hits': 10}, {'id': 'test-id-2', 'alias': 'test-alias-2', 'hits': 20}]

    mock_db = mock_database_connection()
    mock_db.query.return_value = [{'id': 'test-id-1', 'alias': 'test-alias-1', 'hits': 10}, {'id': 'test-id-2', 'alias': 'test-alias-2', 'hits': 20}]

    # Act
    result = get_analytics_for_all_links(start_date, end_date)

    # Assert
    assert result == expected_result

def test_get_analytics_for_all_links_no_data(mock_database_connection):
    # Arrange
    start_date = '2022-01-01'
    end_date = '2022-01-31'
    expected_result = []

    mock_db = mock_database_connection()
    mock_db.query.return_value = []

    # Act
    result = get_analytics_for_all_links(start_date, end_date)

    # Assert
    assert result == expected_result