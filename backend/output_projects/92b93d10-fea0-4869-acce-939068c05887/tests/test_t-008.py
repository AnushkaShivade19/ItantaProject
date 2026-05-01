# Test database persistence by adding a bookmark, restarting the application, and verifying that the bookmark is still present in the database.

import pytest
from database import Database
from models import Bookmark
from unittest.mock import patch

@pytest.fixture
def db():
    return Database()

def test_add_bookmark_persists(db):
    # Arrange
    bookmark = Bookmark(url='https://example.com', title='Example Bookmark')
    
    # Act
    db.add_bookmark(bookmark)
    db.restart()
    
    # Assert
    assert db.get_bookmark(bookmark.id) == bookmark

def test_delete_bookmark_persists(db):
    # Arrange
    bookmark = Bookmark(url='https://example.com', title='Example Bookmark')
    db.add_bookmark(bookmark)
    db.restart()
    
    # Act
    db.delete_bookmark(bookmark.id)
    db.restart()
    
    # Assert
    assert db.get_bookmark(bookmark.id) is None

def test_list_bookmarks_persists(db):
    # Arrange
    bookmark1 = Bookmark(url='https://example1.com', title='Example Bookmark 1')
    bookmark2 = Bookmark(url='https://example2.com', title='Example Bookmark 2')
    db.add_bookmark(bookmark1)
    db.add_bookmark(bookmark2)
    db.restart()
    
    # Act
    bookmarks = db.list_bookmarks()
    
    # Assert
    assert len(bookmarks) == 2
    assert bookmark1 in bookmarks
    assert bookmark2 in bookmarks