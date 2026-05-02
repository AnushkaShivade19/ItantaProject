# Test the creation of public/index.html with basic HTML structure.

import os
import pytest
from pathlib import Path

def test_index_html_exists():
    # Check if the index.html file exists in the public directory
    assert Path('7th-heaven-bakery/public/index.html').is_file()

def test_index_html_basic_structure():
    # Check if the index.html file has a basic HTML structure
    with open('7th-heaven-bakery/public/index.html', 'r') as file:
        content = file.read()
        assert '<html>' in content
        assert '<head>' in content
        assert '<body>' in content
        assert '</html>' in content
        assert '</head>' in content
        assert '</body>' in content

def test_index_html_content():
    # Check if the index.html file has some basic content
    with open('7th-heaven-bakery/public/index.html', 'r') as file:
        content = file.read()
        assert '<title>7th Heaven Bakery</title>' in content
        assert '<h1>Welcome to 7th Heaven Bakery</h1>' in content