# Test suite for HeroSection.css file creation

import pytest
import os
from pathlib import Path

def test_hero_section_css_file_exists():
    # Check if the HeroSection.css file exists
    file_path = Path('7th-heaven-bakery/src/styles/HeroSection.css')
    assert file_path.is_file()

def test_hero_section_css_file_content():
    # Check if the HeroSection.css file has the expected content
    file_path = Path('7th-heaven-bakery/src/styles/HeroSection.css')
    with open(file_path, 'r') as file:
        content = file.read()
        assert 'Hero Section styles' in content

def test_hero_section_css_file_not_empty():
    # Check if the HeroSection.css file is not empty
    file_path = Path('7th-heaven-bakery/src/styles/HeroSection.css')
    assert os.path.getsize(file_path) > 0