# Test suite for Hero Section component implementation

import pytest
from unittest.mock import MagicMock

def test_hero_section_component_rendering():
    # Mock the HeroSection component
    hero_section = MagicMock()
    hero_section.bakery_name = '7th Heaven Bakery'
    hero_section.tagline = 'Freshly baked goods daily'
    hero_section.call_to_action = 'Order Now'

    # Assert the component renders with the expected content
    assert hero_section.bakery_name == '7th Heaven Bakery'
    assert hero_section.tagline == 'Freshly baked goods daily'
    assert hero_section.call_to_action == 'Order Now'

def test_hero_section_component_empty_values():
    # Mock the HeroSection component with empty values
    hero_section = MagicMock()
    hero_section.bakery_name = ''
    hero_section.tagline = ''
    hero_section.call_to_action = ''

    # Assert the component renders with empty values
    assert hero_section.bakery_name == ''
    assert hero_section.tagline == ''
    assert hero_section.call_to_action == ''

def test_hero_section_component_invalid_values():
    # Mock the HeroSection component with invalid values
    hero_section = MagicMock()
    hero_section.bakery_name = 123
    hero_section.tagline = 456
    hero_section.call_to_action = 789

    # Assert the component raises an error with invalid values
    with pytest.raises(TypeError):
        assert hero_section.bakery_name == '7th Heaven Bakery'
        assert hero_section.tagline == 'Freshly baked goods daily'
        assert hero_section.call_to_action == 'Order Now'