# Test module for link CRUD operations

import pytest
from backend.models.link import Link
from backend.utils.database import Database
from unittest.mock import patch, MagicMock

@pytest.fixture
def mock_database():
    with patch('backend.utils.database.Database') as mock_db:
        yield mock_db

def test_create_link(mock_database):
    # Arrange
    link = Link(long_url='https://example.com', alias='example')
    mock_database.return_value.create_link.return_value = link

    # Act
    created_link = Database().create_link(link)

    # Assert
    assert created_link.long_url == link.long_url
    assert created_link.alias == link.alias

def test_get_link(mock_database):
    # Arrange
    link = Link(long_url='https://example.com', alias='example')
    mock_database.return_value.get_link.return_value = link

    # Act
    retrieved_link = Database().get_link(link.alias)

    # Assert
    assert retrieved_link.long_url == link.long_url
    assert retrieved_link.alias == link.alias

def test_update_link(mock_database):
    # Arrange
    link = Link(long_url='https://example.com', alias='example')
    updated_link = Link(long_url='https://updated.example.com', alias='example')
    mock_database.return_value.update_link.return_value = updated_link

    # Act
    updated_link = Database().update_link(link.alias, updated_link)

    # Assert
    assert updated_link.long_url == updated_link.long_url
    assert updated_link.alias == updated_link.alias

def test_delete_link(mock_database):
    # Arrange
    link = Link(long_url='https://example.com', alias='example')
    mock_database.return_value.delete_link.return_value = True

    # Act
    deleted = Database().delete_link(link.alias)

    # Assert
    assert deleted == True