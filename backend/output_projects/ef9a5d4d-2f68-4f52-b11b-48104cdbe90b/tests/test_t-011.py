# Test suite for MenuSection.css file creation
import pytest
from pathlib import Path

def test_menu_section_css_file_exists():
    # Check if the MenuSection.css file exists
    menu_section_css_file = Path('7th-heaven-bakery/src/styles/MenuSection.css')
    assert menu_section_css_file.exists()

def test_menu_section_css_file_content():
    # Check if the MenuSection.css file has the expected content
    menu_section_css_file = Path('7th-heaven-bakery/src/styles/MenuSection.css')
    with open(menu_section_css_file, 'r') as file:
        content = file.read()
    assert 'Menu Section styles' in content

def test_menu_section_css_file_is_not_empty():
    # Check if the MenuSection.css file is not empty
    menu_section_css_file = Path('7th-heaven-bakery/src/styles/MenuSection.css')
    with open(menu_section_css_file, 'r') as file:
        content = file.read()
    assert len(content) > 0