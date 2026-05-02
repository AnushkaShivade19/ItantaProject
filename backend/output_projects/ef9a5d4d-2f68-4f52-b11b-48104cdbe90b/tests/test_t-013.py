# Test suite for OrderForm.css file creation

import os
import pytest

def test_order_form_css_file_exists():
    # Check if the OrderForm.css file exists
    assert os.path.exists('7th-heaven-bakery/src/styles/OrderForm.css')

def test_order_form_css_file_content():
    # Check if the OrderForm.css file has the expected content
    with open('7th-heaven-bakery/src/styles/OrderForm.css', 'r') as file:
        content = file.read()
        assert 'Order Form' in content
        assert 'Contact Form' in content

def test_order_form_css_file_styles():
    # Check if the OrderForm.css file has the expected styles
    with open('7th-heaven-bakery/src/styles/OrderForm.css', 'r') as file:
        content = file.read()
        assert '.order-form' in content
        assert '.contact-form' in content