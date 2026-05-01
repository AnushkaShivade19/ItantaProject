# Test module for bookmark model
"""Tests for the bookmark model"""

import pytest
from models.bookmark import Bookmark
from unittest.mock import patch, MagicMock

@pytest.fixture
def mock_database():
    with patch('models.bookmark.Database') as mock_db:
        yield mock_db

def test_create_bookmark(mock_database):
    # Arrange
    bookmark = Bookmark(url='https://example.com', title='Example')
    mock_database.return_value.create_bookmark.return_value = 1
    
    # Act
    result = bookmark.create()
    
    # Assert
    assert result == 1
    mock_database.return_value.create_bookmark.assert_called_once_with(bookmark.url, bookmark.title)

def test_read_bookmark(mock_database):
    # Arrange
    bookmark = Bookmark(id=1, url='https://example.com', title='Example')
    mock_database.return_value.get_bookmark.return_value = (1, 'https://example.com', 'Example')
    
    # Act
    result = bookmark.read()
    
    # Assert
    assert result == (1, 'https://example.com', 'Example')
    mock_database.return_value.get_bookmark.assert_called_once_with(bookmark.id)

def test_update_bookmark(mock_database):
    # Arrange
    bookmark = Bookmark(id=1, url='https://example.com', title='Example')
    mock_database.return_value.update_bookmark.return_value = 1
    
    # Act
    result = bookmark.update()
    
    # Assert
    assert result == 1
    mock_database.return_value.update_bookmark.assert_called_once_with(bookmark.id, bookmark.url, bookmark.title)

def test_delete_bookmark(mock_database):
    # Arrange
    bookmark = Bookmark(id=1, url='https://example.com', title='Example')
    mock_database.return_value.delete_bookmark.return_value = 'Bookmark deleted'
    
    # Act
    result = bookmark.delete()
    
    # Assert
    assert result == 'Bookmark deleted'
    mock_database.return_value.delete_bookmark.assert_called_once_with(bookmark.id)