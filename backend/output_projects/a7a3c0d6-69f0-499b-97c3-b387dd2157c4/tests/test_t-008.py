# Test the database CRUD operations for links
import pytest
from url_shortener.backend.models import Link
from unittest.mock import MagicMock

@pytest.fixture
def mock_db():
    return MagicMock()

def test_create_link(mock_db):
    # Test creating a new link
    link = Link(long_url='https://example.com', alias='example')
    mock_db.create_link.return_value = link
    assert mock_db.create_link(link.long_url, link.alias) == link

def test_get_link(mock_db):
    # Test retrieving a link by alias
    link = Link(long_url='https://example.com', alias='example')
    mock_db.get_link.return_value = link
    assert mock_db.get_link(link.alias) == link

def test_update_link(mock_db):
    # Test updating a link
    link = Link(long_url='https://example.com', alias='example')
    updated_link = Link(long_url='https://updated.example.com', alias='example')
    mock_db.update_link.return_value = updated_link
    assert mock_db.update_link(link.alias, updated_link.long_url) == updated_link

def test_delete_link(mock_db):
    # Test deleting a link
    link = Link(long_url='https://example.com', alias='example')
    mock_db.delete_link.return_value = None
    assert mock_db.delete_link(link.alias) is None