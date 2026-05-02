# Test suite for the review component
import pytest
from unittest.mock import Mock
from frontend.components.Review import Review

def test_review_component_definition():
    # Test that the review component is correctly defined
    review = Review()
    assert review is not None

def test_review_component_display():
    # Test that the review component can be used to display reviews
    review = Review()
    review_text = 'This is a great bakery!'
    review_rating = 5
    review.display_review(review_text, review_rating)
    # Mock the display_review method to verify it was called
    review.display_review = Mock()
    review.display_review.assert_called_once_with(review_text, review_rating)

def test_review_component_invalid_input():
    # Test that the review component handles invalid input
    review = Review()
    review_text = None
    review_rating = None
    with pytest.raises(Exception):
        review.display_review(review_text, review_rating)