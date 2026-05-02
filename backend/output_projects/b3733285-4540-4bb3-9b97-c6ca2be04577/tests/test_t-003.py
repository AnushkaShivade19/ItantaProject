# Test the frontend directory structure
"""Tests for the frontend directory structure"""

import os
import pytest

@pytest.fixture
def frontend_dir():
    return '7th-heaven-bakery/frontend/'

def test_frontend_directory_exists(frontend_dir):
    assert os.path.exists(frontend_dir)

def test_frontend_directory_is_directory(frontend_dir):
    assert os.path.isdir(frontend_dir)

def test_frontend_subdirectories_exist(frontend_dir):
    subdirectories = ['components', 'pages', 'public', 'styles']
    for subdirectory in subdirectories:
        assert os.path.exists(os.path.join(frontend_dir, subdirectory))
        assert os.path.isdir(os.path.join(frontend_dir, subdirectory))