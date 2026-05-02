# Test the backend directory structure
"""Tests for the backend directory structure"""

import os
import pytest

@pytest.fixture
def backend_dir():
    return '7th-heaven-bakery/backend/'

def test_backend_directory_exists(backend_dir):
    assert os.path.exists(backend_dir)

def test_backend_subdirectories_exist(backend_dir):
    subdirectories = ['auth', 'menu', 'orders', 'payment']
    for subdirectory in subdirectories:
        assert os.path.exists(os.path.join(backend_dir, subdirectory))

def test_backend_directory_structure(backend_dir):
    assert os.path.isdir(backend_dir)
    assert os.path.isdir(os.path.join(backend_dir, 'auth'))
    assert os.path.isdir(os.path.join(backend_dir, 'menu'))
    assert os.path.isdir(os.path.join(backend_dir, 'orders'))
    assert os.path.isdir(os.path.join(backend_dir, 'payment'))