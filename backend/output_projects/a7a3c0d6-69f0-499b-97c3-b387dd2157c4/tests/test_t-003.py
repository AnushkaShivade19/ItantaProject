# Test module for database models implementation
import pytest
from url_shortener.backend.models import Link
from unittest.mock import MagicMock

@pytest.fixture
def mock_db_session():
    return MagicMock()

def test_link_model_creation(mock_db_session):
    # Test happy path
    link = Link(long_url='https://example.com', alias='example')
    assert link.long_url == 'https://example.com'
    assert link.alias == 'example'
    assert link.hit_count == 0

def test_link_model_unique_alias(mock_db_session):
    # Test unique alias constraint
    link1 = Link(long_url='https://example1.com', alias='example')
    link2 = Link(long_url='https://example2.com', alias='example')
    with pytest.raises(Exception):
        mock_db_session.add(link1)
        mock_db_session.add(link2)
        mock_db_session.commit()

def test_link_model_required_fields(mock_db_session):
    # Test required fields
    with pytest.raises(Exception):
        Link(alias='example')

def test_link_model_hit_count_increment(mock_db_session):
    # Test hit count increment
    link = Link(long_url='https://example.com', alias='example')
    link.hit_count = 0
    link.increment_hit_count()
    assert link.hit_count == 1