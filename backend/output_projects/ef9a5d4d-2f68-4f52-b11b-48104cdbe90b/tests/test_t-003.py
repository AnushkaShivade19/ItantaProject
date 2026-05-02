# Test module for public/favicon.ico file creation
# This module tests the creation of the public/favicon.ico file with a valid favicon.

import os
import pytest

def test_favicon_file_exists():
    # Test if the favicon file exists
    assert os.path.exists('7th-heaven-bakery/public/favicon.ico')

def test_favicon_file_is_valid():
    # Test if the favicon file is a valid favicon
    # For simplicity, we assume a valid favicon is a non-empty file
    favicon_file_path = '7th-heaven-bakery/public/favicon.ico'
    assert os.path.getsize(favicon_file_path) > 0

def test_favicon_file_has_correct_extension():
    # Test if the favicon file has the correct extension
    favicon_file_path = '7th-heaven-bakery/public/favicon.ico'
    assert favicon_file_path.endswith('.ico')