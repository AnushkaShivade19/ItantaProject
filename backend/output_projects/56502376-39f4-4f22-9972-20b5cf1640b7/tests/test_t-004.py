"""
Tests for ReviewsSection.js component existence and required props
"""
import os
import pytest

def test_reviews_section_file_exists():
    """Verify ReviewsSection.js file is created"""
    assert os.path.exists('7th-heaven-bakery/src/components/ReviewsSection.js'), \
        'ReviewsSection.js file not found'

def test_reviews_section_has_required_props():
    """Verify component has required props"""
    file_path = '7th-heaven-bakery/src/components/ReviewsSection.js'
    
    # This will fail initially as file doesn't exist
    with open(file_path) as f:
        content = f.read()
        assert 'reviews' in content, 'Missing reviews prop definition'
        assert 'onReviewSubmit' in content, 'Missing onReviewSubmit prop definition'
        assert 'averageRating' in content, 'Missing averageRating prop definition'