# Test API documentation implementation
import pytest
from url_shortener.backend.docs.api import get_api_documentation
from unittest.mock import patch

def test_api_documentation_exists():