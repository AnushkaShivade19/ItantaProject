# Test the API routes for orders
import pytest
from backend.routes import app
from unittest.mock import patch
import json

@pytest.fixture
def client():
    return app.test_client()

def test_create_order(client):
    # Test creating an order with valid data
    data = {
        'items': [
            {'id': '123e4567-e89b-12d3-a456-426614174000', 'name': 'Test Item', 'quantity': 2}
        ]
    }
    response = client.post('/api/orders', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 201
    assert 'id' in response.json
    assert 'status' in response.json

def test_create_order_invalid_data(client):
    # Test creating an order with invalid data
    data = {
        'items': [
            {'id': '123e4567-e89b-12d3-a456-426614174000'}
        ]
    }
    response = client.post('/api/orders', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 400

def test_create_order_empty_data(client):
    # Test creating an order with empty data
    data = {}
    response = client.post('/api/orders', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 400

def test_create_order_missing_items(client):
    # Test creating an order with missing items
    data = {
        'other_field': 'value'
    }
    response = client.post('/api/orders', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 400