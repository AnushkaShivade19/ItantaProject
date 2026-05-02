# Test the API routes for menu items
import pytest
from backend.routes import app
from unittest.mock import patch
import json

@pytest.fixture
def client():
    return app.test_client()

def test_get_menu_items(client):
    # Test that the API route for getting menu items returns a list of menu items
    response = client.get('/api/menu')
    assert response.status_code == 200
    assert 'items' in response.json
    assert isinstance(response.json['items'], list)

def test_get_menu_items_empty(client):
    # Test that the API route for getting menu items returns an empty list when there are no menu items
    with patch('backend.routes.get_menu_items') as mock_get_menu_items:
        mock_get_menu_items.return_value = []
        response = client.get('/api/menu')
        assert response.status_code == 200
        assert 'items' in response.json
        assert response.json['items'] == []

def test_get_menu_items_error(client):
    # Test that the API route for getting menu items returns an error when there is a database error
    with patch('backend.routes.get_menu_items') as mock_get_menu_items:
        mock_get_menu_items.side_effect = Exception('Database error')
        response = client.get('/api/menu')
        assert response.status_code == 500
        assert 'error' in response.json