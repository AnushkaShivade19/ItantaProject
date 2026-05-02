"""
Tests for Reviews Section carousel/grid layout implementation
"""
import pytest
from 7th_heaven_bakery.src.components.reviews_section import ReviewsSection


def test_reviews_section_initializes():
    section = ReviewsSection()
    assert section is not None


def test_reviews_section_has_carousel_layout():
    section = ReviewsSection()
    assert hasattr(section, 'carousel_layout')
    assert section.carousel_layout is True


def test_reviews_section_displays_reviews():
    section = ReviewsSection()
    assert len(section.reviews) > 0
    assert all('text' in review for review in section.reviews)