# Test module for API routes for reviews

import pytest
from unittest.mock import patch
from backend.routes import reviews_routes

@pytest.fixture
def mock_reviews_db():
    with patch('backend.routes.reviews_db') as mock_db:
        yield mock_db

def test_get_reviews(mock_reviews_db):
    # Arrange
    mock_reviews_db.get_reviews.return_value = [
        {'id': 'uuid1', 'text': 'review1', 'rating': 5},
        {'id': 'uuid2', 'text': 'review2', 'rating': 4}
    ]
    
    # Act
    response = reviews_routes.get_reviews()
    
    # Assert
    assert response.status_code == 200
    assert len(response.json()['items']) == 2

def test_get_reviews_empty(mock_reviews_db):
    # Arrange
    mock_reviews_db.get_reviews.return_value = []
    
    # Act
    response = reviews_routes.get_reviews()
    
    # Assert
    assert response.status_code == 200
    assert len(response.json()['items']) == 0

def test_get_reviews_error(mock_reviews_db):
    # Arrange
    mock_reviews_db.get_reviews.side_effect = Exception('Mocked error')
    
    # Act and Assert
    with pytest.raises(Exception):
        reviews_routes.get_reviews()