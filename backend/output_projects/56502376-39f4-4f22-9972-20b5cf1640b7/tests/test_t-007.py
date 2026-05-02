import pytest
from pathlib import Path

def test_index_html_exists():
    path = Path('7th-heaven-bakery/public/index.html')
    assert path.exists(), 'index.html file not found'

def test_index_html_content():
    path = Path('7th-heaven-bakery/public/index.html')
    content = path.read_text()
    assert '<!DOCTYPE html>' in content
    assert '<html>' in content
    assert '<head>' in content
    assert '<body>' in content