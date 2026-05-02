# Test the database models for the bakery website.

import pytest
from backend.models import MenuItem, Review, Order
from unittest.mock import MagicMock

@pytest.fixture
def mock_db_session():
    return MagicMock()

def test_menu_item_model(mock_db_session):
    # Test that a MenuItem can be created and saved to the database.
    item = MenuItem(name='Test Item', price=10.99)
    mock_db_session.add(item)
    mock_db_session.commit()
    assert item.id is not None

def test_review_model(mock_db_session):
    # Test that a Review can be created and saved to the database.
    review = Review(text='Test Review', rating=5)
    mock_db_session.add(review)
    mock_db_session.commit()
    assert review.id is not None

def test_order_model(mock_db_session):
    # Test that an Order can be created and saved to the database.
    order = Order(status='pending')
    mock_db_session.add(order)
    mock_db_session.commit()
    assert order.id is not None

def test_menu_item_model_invalid_price(mock_db_session):
    # Test that a MenuItem with an invalid price raises an error.
    with pytest.raises(ValueError):
        MenuItem(name='Test Item', price=-10.99)