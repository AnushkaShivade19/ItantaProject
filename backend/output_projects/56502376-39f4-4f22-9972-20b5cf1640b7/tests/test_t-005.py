import pytest
import os

def test_order_form_file_exists():
    assert os.path.exists('7th-heaven-bakery/src/components/OrderForm.js')

def test_order_form_has_required_props():
    with open('7th-heaven-bakery/src/components/OrderForm.js') as f:
        content = f.read()
        assert 'function OrderForm' in content
        assert 'propTypes' in content
        assert 'defaultProps' in content