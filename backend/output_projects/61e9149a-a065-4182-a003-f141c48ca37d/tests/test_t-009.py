# Test the menu page functionality
"""Tests for the menu page"""

import pytest
from frontend.pages.menu import MenuPage
from unittest.mock import patch, MagicMock

@pytest.fixture
def mock_menu_api():
    with patch('frontend.pages.menu.get_menu_items') as mock_get_menu_items:
        yield mock_get_menu_items

def test_menu_page_definition():
    # Test that the menu page is correctly defined
    menu_page = MenuPage()
    assert menu_page is not None

def test_menu_page_display(mock_menu_api):
    # Test that the menu page can display menu items
    mock_menu_api.return_value = [{'id': '1', 'name': 'Item 1', 'price': 10.99}]
    menu_page = MenuPage()
    menu_items = menu_page.get_menu_items()
    assert len(menu_items) == 1
    assert menu_items[0]['name'] == 'Item 1'

def test_menu_page_empty(mock_menu_api):
    # Test that the menu page handles an empty menu
    mock_menu_api.return_value = []
    menu_page = MenuPage()
    menu_items = menu_page.get_menu_items()
    assert len(menu_items) == 0