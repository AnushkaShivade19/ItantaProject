# Test the home page functionality
"""Tests for the home page"""

import pytest
from unittest.mock import patch, MagicMock
from frontend.pages.index import HomePage

@pytest.fixture
def mock_menu_api():
    with patch('requests.get') as mock_get:
        mock_response = MagicMock()
        mock_response.json.return_value = {'items': [{'id': 'uuid', 'name': 'menu item', 'price': 10.99}]}
        mock_get.return_value = mock_response
        yield

@pytest.fixture
def mock_reviews_api():
    with patch('requests.get') as mock_get:
        mock_response = MagicMock()
        mock_response.json.return_value = {'items': [{'id': 'uuid', 'text': 'review text', 'rating': 5}]}
        mock_get.return_value = mock_response
        yield

def test_home_page_definition():
    # Arrange and Act
    home_page = HomePage()
    
    # Assert
    assert home_page is not None

def test_home_page_menu_display(mock_menu_api):
    # Arrange
    home_page = HomePage()
    
    # Act
    menu_items = home_page.get_menu_items()
    
    # Assert
    assert len(menu_items) > 0
    assert menu_items[0]['id'] == 'uuid'
    assert menu_items[0]['name'] == 'menu item'
    assert menu_items[0]['price'] == 10.99

def test_home_page_reviews_display(mock_reviews_api):
    # Arrange
    home_page = HomePage()
    
    # Act
    reviews = home_page.get_reviews()
    
    # Assert
    assert len(reviews) > 0
    assert reviews[0]['id'] == 'uuid'
    assert reviews[0]['text'] == 'review text'
    assert reviews[0]['rating'] == 5