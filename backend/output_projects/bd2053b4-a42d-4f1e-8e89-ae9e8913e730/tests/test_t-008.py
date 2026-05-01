# Test module for bookmark persistence
# This module tests the persistence of bookmarks between application restarts.

import pytest
from bookmark import Bookmark
from database import Database
from unittest.mock import patch

@pytest.fixture
def db():
    return Database()

def test_add_bookmark_persists(db):
    # Arrange
    bookmark = Bookmark('https://example.com', 'Example')
    # Act
    db.add_bookmark(bookmark)
    # Assert
    assert db.get_bookmark(bookmark.id) == bookmark

def test_restart_application_persists_bookmarks(db):
    # Arrange
    bookmark = Bookmark('https://example.com', 'Example')
    db.add_bookmark(bookmark)
    # Act
    db.restart_application()
    # Assert
    assert db.get_bookmark(bookmark.id) == bookmark

def test_delete_bookmark_persists(db):
    # Arrange
    bookmark = Bookmark('https://example.com', 'Example')
    db.add_bookmark(bookmark)
    # Act
    db.delete_bookmark(bookmark.id)
    # Assert
    assert db.get_bookmark(bookmark.id) is None

def test_search_bookmarks_persists(db):
    # Arrange
    bookmark = Bookmark('https://example.com', 'Example')
    db.add_bookmark(bookmark)
    # Act
    results = db.search_bookmarks('Example')
    # Assert
    assert bookmark in results