# Test the online ordering feature
import pytest
from unittest.mock import patch
from frontend.utils.api import create_order

def test_create_order_happy_path():
    # Mock the API call to create an order
    with patch('frontend.utils.api.create_order') as mock_create_order:
        # Set up the mock response
        mock_create_order.return_value = {'id': '1234', 'status': 'pending'}
        
        # Call the create_order function
        order = create_order([{'id': 'item1', 'name': 'Item 1', 'quantity': 2}])
        
        # Assert that the order was created successfully
        assert order['id'] == '1234'
        assert order['status'] == 'pending'

def test_create_order_empty_items():
    # Test that an error is raised when the items list is empty
    with pytest.raises(ValueError):
        create_order([])

def test_create_order_invalid_item():
    # Test that an error is raised when an item is invalid
    with pytest.raises(ValueError):
        create_order([{'id': 'item1', 'name': 'Item 1'}])  # Missing quantity