# Test the database schema for the bookmarks table.

import pytest
from backend.models import Bookmark
from unittest.mock import MagicMock

@pytest.fixture
def mock_database():
    return MagicMock()

def test_bookmark_schema_has_id_field(mock_database):
    # Arrange
    bookmark = Bookmark()
    
    # Act
    fields = [field.name for field in bookmark.__table__.columns]
    
    # Assert
    assert 'id' in fields

def test_bookmark_schema_has_url_field(mock_database):
    # Arrange
    bookmark = Bookmark()
    
    # Act
    fields = [field.name for field in bookmark.__table__.columns]
    
    # Assert
    assert 'url' in fields

def test_bookmark_schema_has_title_field(mock_database):
    # Arrange
    bookmark = Bookmark()
    
    # Act
    fields = [field.name for field in bookmark.__table__.columns]
    
    # Assert
    assert 'title' in fields

def test_bookmark_schema_id_field_is_primary_key(mock_database):
    # Arrange
    bookmark = Bookmark()
    
    # Act
    primary_keys = [field.name for field in bookmark.__table__.columns if field.primary_key]
    
    # Assert
    assert 'id' in primary_keys

def test_bookmark_schema_url_field_is_not_null(mock_database):
    # Arrange
    bookmark = Bookmark()
    
    # Act
    nullable_fields = [field.name for field in bookmark.__table__.columns if not field.nullable]
    
    # Assert
    assert 'url' in nullable_fields

def test_bookmark_schema_title_field_is_not_null(mock_database):
    # Arrange
    bookmark = Bookmark()
    
    # Act
    nullable_fields = [field.name for field in bookmark.__table__.columns if not field.nullable]
    
    # Assert
    assert 'title' in nullable_fields