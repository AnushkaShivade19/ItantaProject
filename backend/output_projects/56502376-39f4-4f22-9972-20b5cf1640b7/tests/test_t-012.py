"""
Tests for OrderForm.js component implementation
"""
import pytest
from seventh_heaven_bakery.src.components import OrderForm

def test_orderform_component_exists():
    assert OrderForm is not None

def test_orderform_has_required_props():
    required_props = ['name', 'email', 'orderDetails']
    for prop in required_props:
        assert hasattr(OrderForm, prop)

def test_orderform_props_are_functions():
    assert callable(OrderForm.name)
    assert callable(OrderForm.email)
    assert callable(OrderForm.orderDetails)