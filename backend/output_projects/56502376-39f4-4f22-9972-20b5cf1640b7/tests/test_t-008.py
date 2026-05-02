"""
Tests for the index.js file creation in 7th-heaven-bakery/src
"""
import os

def test_index_js_file_exists():
    """Verify index.js file is created"""
    assert os.path.exists('7th-heaven-bakery/src/index.js'), \
        'index.js file not found in src directory'

def test_index_js_has_required_content():
    """Verify index.js contains required content"""
    with open('7th-heaven-bakery/src/index.js') as f:
        content = f.read()
        assert 'console.log("Hello from 7th Heaven Bakery");' in content, \
            'Missing required content in index.js'