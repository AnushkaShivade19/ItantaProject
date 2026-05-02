# Test the project directory structure
"""Tests for the project directory structure"""

import os
import pytest

def test_project_directory_exists():
    assert os.path.exists('7th-heaven-bakery/')

def test_project_subdirectories_exist():
    assert os.path.exists('7th-heaven-bakery/auth')
    assert os.path.exists('7th-heaven-bakery/menu')
    assert os.path.exists('7th-heaven-bakery/orders')
    assert os.path.exists('7th-heaven-bakery/payment')

def test_project_directory_structure():
    assert os.path.isdir('7th-heaven-bakery/')
    assert os.path.isdir('7th-heaven-bakery/auth')
    assert os.path.isdir('7th-heaven-bakery/menu')
    assert os.path.isdir('7th-heaven-bakery/orders')
    assert os.path.isdir('7th-heaven-bakery/payment')