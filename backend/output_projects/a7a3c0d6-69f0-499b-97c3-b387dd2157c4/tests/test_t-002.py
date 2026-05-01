# Test the database schema definition
"""Tests for the database schema definition"""

import pytest
from url_shortener.backend.models import Link
from unittest.mock import MagicMock

@pytest.fixture
def mock_db_session():
    return MagicMock()

def test_link_model_has_correct_fields(mock_db_session):
    link = Link(long_url='https://example.com', alias='example')
    assert hasattr(link, 'id')
    assert hasattr(link, 'long_url')
    assert hasattr(link, 'alias')
    assert hasattr(link, 'hit_count')
    assert hasattr(link, 'created_at')

def test_link_model_has_correct_field_types(mock_db_session):
    link = Link(long_url='https://example.com', alias='example')
    assert isinstance(link.id, str)
    assert isinstance(link.long_url, str)
    assert isinstance(link.alias, str)
    assert isinstance(link.hit_count, int)
    assert isinstance(link.created_at, str)

def test_link_model_has_unique_alias_constraint(mock_db_session):
    link1 = Link(long_url='https://example.com', alias='example')
    link2 = Link(long_url='https://example2.com', alias='example')
    with pytest.raises(Exception):
        mock_db_session.add(link1)
        mock_db_session.add(link2)
        mock_db_session.commit()

def test_link_model_has_not_null_long_url_constraint(mock_db_session):
    link = Link(alias='example')
    with pytest.raises(Exception):
        mock_db_session.add(link)
        mock_db_session.commit()