import unittest
from unittest.mock import patch, MagicMock
from url_shortener.backend.analytics import get_hit_count, get_stats

class AnalyticsTests:
    def test_hit_count(self):
        with patch('url_shortener.backend.analytics.get_hit_count') as mock_get_hit_count:
            mock_get_hit_count.return_value = 1
            assert get_hit_count() == 1

    def test_get_stats(self):
        with patch('url_shortener.backend.analytics.get_stats') as mock_get_stats:
            mock_get_stats.return_value = {'id': 'uuid', 'long_url': 'string', 'hit_count': 1, 'created_at': 'datetime'}
            assert get_stats() == {'id': 'uuid', 'long_url': 'string', 'hit_count': 1, 'created_at': 'datetime'}

    def test_empty_stats(self):
        with patch('url_shortener.backend.analytics.get_stats') as mock_get_stats:
            mock_get_stats.return_value = None
            assert get_stats() is None
