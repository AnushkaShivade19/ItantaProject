# Test suite for src/styles/App.css file creation with global app styles.

import os
import pytest

def test_app_css_file_exists():
    # Check if the App.css file exists in the src/styles directory
    assert os.path.isfile('7th-heaven-bakery/src/styles/App.css')

def test_app_css_file_content():
    # Check if the App.css file contains global app styles
    with open('7th-heaven-bakery/src/styles/App.css', 'r') as file:
        content = file.read()
        assert 'body' in content
        assert 'font-family' in content

def test_app_css_file_not_empty():
    # Check if the App.css file is not empty
    with open('7th-heaven-bakery/src/styles/App.css', 'r') as file:
        content = file.read()
        assert len(content) > 0

def test_app_css_file_has_global_styles():
    # Check if the App.css file contains global styles
    with open('7th-heaven-bakery/src/styles/App.css', 'r') as file:
        content = file.read()
        assert 'global' in content or 'app' in content