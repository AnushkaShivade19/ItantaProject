"""
Tests for grid layout implementation in MenuSection component
"""
import pytest
from 7th_heaven_bakery.src.components.menu_section import MenuSection

def test_component_uses_grid_layout():
    component = MenuSection()
    assert 'display: grid' in component.get_css(), "Component must use CSS grid layout"

def test_grid_has_minimum_columns():
    component = MenuSection()
    assert component.grid_template_columns >= 2, "Grid must have at least 2 columns"

def test_grid_gap_is_set():
    component = MenuSection()
    assert component.grid_gap == '1rem', "Grid gap must be 1rem by default"

def test_invalid_item_placement():
    component = MenuSection(items=[])
    with pytest.raises(ValueError):
        component.add_item(None)