# Test the API endpoint for searching bookmarks
"""Test the API endpoint for searching bookmarks"""

import pytest
from unittest.mock import patch
from backend.routes import app
from fastapi.testclient import TestClient
from database import db_session

@pytest.fixture
def client():
    return TestClient(app)

def test_search_bookmarks_by_keyword(client):
    # Add some bookmarks to the database
    db_session.add_all([
        {'url': 'https://www.example.com', 'title': 'Example Bookmark'},
        {'url': 'https://www.google.com', 'title': 'Google Bookmark'},
        {'url': 'https://www.python.org', 'title': 'Python Bookmark'}
    ])
    db_session.commit()

    # Search for bookmarks with keyword 'example'
    response = client.get('/api/bookmarks/search', params={'keyword': 'example'})

    # Check if the response is successful
    assert response.status_code == 200

    # Check if the response contains the expected bookmarks
    expected_bookmarks = [
        {'id': 1, 'url': 'https://www.example.com', 'title': 'Example Bookmark'}
    ]
    assert response.json() == expected_bookmarks

def test_search_bookmarks_by_keyword_case_insensitive(client):
    # Add some bookmarks to the database
    db_session.add_all([
        {'url': 'https://www.example.com', 'title': 'Example Bookmark'},
        {'url': 'https://www.google.com', 'title': 'Google Bookmark'},
        {'url': 'https://www.python.org', 'title': 'Python Bookmark'}
    ])
    db_session.commit()

    # Search for bookmarks with keyword 'ExAmPle'
    response = client.get('/api/bookmarks/search', params={'keyword': 'ExAmPle'})

    # Check if the response is successful
    assert response.status_code == 200

    # Check if the response contains the expected bookmarks
    expected_bookmarks = [
        {'id': 1, 'url': 'https://www.example.com', 'title': 'Example Bookmark'}
    ]
    assert response.json() == expected_bookmarks

def test_search_bookmarks_by_keyword_no_results(client):
    # Add some bookmarks to the database
    db_session.add_all([
        {'url': 'https://www.example.com', 'title': 'Example Bookmark'},
        {'url': 'https://www.google.com', 'title': 'Google Bookmark'},
        {'url': 'https://www.python.org', 'title': 'Python Bookmark'}
    ])
    db_session.commit()

    # Search for bookmarks with keyword 'nonexistent'
    response = client.get('/api/bookmarks/search', params={'keyword': 'nonexistent'})

    # Check if the response is successful
    assert response.status_code == 200

    # Check if the response contains an empty list
    assert response.json() == []