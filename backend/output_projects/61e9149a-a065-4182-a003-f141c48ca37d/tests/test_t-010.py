# Test module for reviews page
"""Tests for the reviews page"""

import pytest
from unittest.mock import patch, MagicMock
from frontend.pages.reviews import ReviewsPage

@pytest.fixture
def mock_reviews_api():
    with patch('frontend.pages.reviews.get_reviews') as mock_get_reviews:
        yield mock_get_reviews

def test_reviews_page_definition():
    # Arrange and Act
    reviews_page = ReviewsPage()
    
    # Assert
    assert reviews_page is not None

def test_reviews_page_get_reviews(mock_reviews_api):
    # Arrange
    mock_reviews_api.return_value = [{'id': 'uuid', 'text': 'review text', 'rating': 5}]
    reviews_page = ReviewsPage()
    
    # Act
    reviews = reviews_page.get_reviews()
    
    # Assert
    assert len(reviews) == 1
    assert reviews[0]['id'] == 'uuid'
    assert reviews[0]['text'] == 'review text'
    assert reviews[0]['rating'] == 5

def test_reviews_page_get_reviews_empty(mock_reviews_api):
    # Arrange
    mock_reviews_api.return_value = []
    reviews_page = ReviewsPage()
    
    # Act
    reviews = reviews_page.get_reviews()
    
    # Assert
    assert len(reviews) == 0

def test_reviews_page_get_reviews_error(mock_reviews_api):
    # Arrange
    mock_reviews_api.side_effect = Exception('Mocked error')
    reviews_page = ReviewsPage()
    
    # Act and Assert
    with pytest.raises(Exception):
        reviews_page.get_reviews()