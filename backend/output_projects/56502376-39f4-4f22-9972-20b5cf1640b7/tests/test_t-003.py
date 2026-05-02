"""
Tests for MenuSection.js component props validation
"""
import pytest
from 7th_heaven_bakery.src.components import MenuSection

def test_menu_section_initialization():
    section = MenuSection(title="Desserts", items=["Cake", "Pie"])
    assert section.title == "Desserts"
    assert section.items == ["Cake", "Pie"]

def test_menu_section_missing_title():
    with pytest.raises(ValueError, match="title is required"):
        MenuSection(items=["Bread"])

def test_menu_section_empty_items():
    section = MenuSection(title="Snacks", items=[])\n    assert section.items == []