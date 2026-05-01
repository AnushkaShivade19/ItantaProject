# Test the case-insensitive search functionality of the utils module.

import pytest
from backend.utils import search_bookmarks
from unittest.mock import MagicMock

@pytest.fixture
def mock_bookmarks():
    return [
        {'id': 1, 'url': 'https://example.com', 'title': 'Example Bookmark'},
        {'id': 2, 'url': 'https://example2.com', 'title': 'Another Bookmark'},
        {'id': 3, 'url': 'https://example3.com', 'title': 'Example3 Bookmark'}
    ]

def test_search_bookmarks_case_insensitive(mock_bookmarks):
    # Test that the search function returns the correct bookmarks in a case-insensitive manner.
    results = search_bookmarks(mock_bookmarks, 'example')
    assert len(results) == 2
    assert results[0]['id'] == 1
    assert results[1]['id'] == 3

def test_search_bookmarks_no_results(mock_bookmarks):
    # Test that the search function returns an empty list when no bookmarks match the search keyword.
    results = search_bookmarks(mock_bookmarks, 'nonexistent')
    assert len(results) == 0

def test_search_bookmarks_empty_keyword(mock_bookmarks):
    # Test that the search function returns all bookmarks when the search keyword is empty.
    results = search_bookmarks(mock_bookmarks, '')
    assert len(results) == 3