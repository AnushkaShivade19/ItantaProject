"""
Test suite for HeroSection.js component creation
"""
import pytest
import os

def test_hero_section_file_exists():
    """Verify HeroSection.js file is created"""
    assert os.path.exists('7th-heaven-bakery/src/components/HeroSection.js'), \
        'HeroSection.js file not found' 

def test_hero_section_component_defined():
    """Verify component definition in HeroSection.js"""
    with open('7th-heaven-bakery/src/components/HeroSection.js') as f:
        content = f.read()
        assert 'function HeroSection' in content or 'const HeroSection' in content, \
            'Component definition not found'

def test_hero_section_props_required():
    """Verify required props are implemented"""
    with open('7th-heaven-bakery/src/components/HeroSection.js') as f:
        content = f.read()
        assert 'props.title' in content and 'props.subtitle' in content, \
            'Missing required props in component'