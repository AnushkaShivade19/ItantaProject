# Test the menu component
"""Tests for the menu component"""

import pytest
from unittest.mock import patch
from frontend.components.Menu import Menu

@pytest.fixture
def mock_menu_items():
    return [
        {'id': 'uuid1', 'name': 'Item 1', 'price': 10.99},
        {'id': 'uuid2', 'name': 'Item 2', 'price': 9.99}
    ]

def test_menu_component_definition(mock_menu_items):
    menu = Menu(mock_menu_items)
    assert menu.items == mock_menu_items

def test_menu_component_display(mock_menu_items):
    menu = Menu(mock_menu_items)
    # Mock the display method
    with patch('frontend.components.Menu.display') as mock_display:
        menu.display()
        mock_display.assert_called_once()

def test_menu_component_empty(mock_menu_items):
    menu = Menu([])
    assert menu.items == []

def test_menu_component_invalid_input(mock_menu_items):
    with pytest.raises(TypeError):
        Menu('invalid input')