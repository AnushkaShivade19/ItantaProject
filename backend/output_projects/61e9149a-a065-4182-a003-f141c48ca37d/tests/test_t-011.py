# Test the API client
"""Tests for the API client"""

import pytest
from unittest.mock import patch
from frontend.utils.api import API

@pytest.fixture
def mock_api():
    with patch('frontend.utils.api.requests') as mock_requests:
        yield mock_requests

def test_api_client_get_menu(mock_api):
    # Arrange
    api = API()
    mock_api.get.return_value.json.return_value = {'items': [{'id': 'uuid', 'name': 'string', 'price': 10.99}]}

    # Act
    response = api.get_menu()

    # Assert
    assert response.status_code == 200
    assert response.json()['items'][0]['name'] == 'string'

def test_api_client_get_reviews(mock_api):
    # Arrange
    api = API()
    mock_api.get.return_value.json.return_value = {'items': [{'id': 'uuid', 'text': 'string', 'rating': 5}]}

    # Act
    response = api.get_reviews()

    # Assert
    assert response.status_code == 200
    assert response.json()['items'][0]['text'] == 'string'

def test_api_client_create_order(mock_api):
    # Arrange
    api = API()
    order = {'items': [{'id': 'uuid', 'name': 'string', 'quantity': 2}]}
    mock_api.post.return_value.json.return_value = {'id': 'uuid', 'status': 'pending'}

    # Act
    response = api.create_order(order)

    # Assert
    assert response.status_code == 201
    assert response.json()['status'] == 'pending'

def test_api_client_create_order_invalid_request(mock_api):
    # Arrange
    api = API()
    order = {'items': []}

    # Act and Assert
    with pytest.raises(ValueError):
        api.create_order(order)