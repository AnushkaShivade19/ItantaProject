# Test the database schema file exists and contains the correct table definitions.

import pytest
import os
from unittest.mock import patch

def test_schema_file_exists():
    # Check if the schema file exists
    assert os.path.exists('db/schema.sql')

def test_schema_file_contents():
    # Check if the schema file contains the correct table definitions
    with open('db/schema.sql', 'r') as f:
        schema = f.read()
        assert 'CREATE TABLE menu_items' in schema
        assert 'CREATE TABLE reviews' in schema
        assert 'CREATE TABLE orders' in schema

def test_schema_file_table_definitions():
    # Check if the schema file contains the correct table definitions
    with open('db/schema.sql', 'r') as f:
        schema = f.read()
        assert 'id uuid PRIMARY KEY' in schema
        assert 'name string NOT NULL' in schema
        assert 'price float NOT NULL' in schema
        assert 'text string NOT NULL' in schema
        assert 'rating int NOT NULL' in schema
        assert 'status string NOT NULL' in schema

def test_schema_file_indexes():
    # Check if the schema file contains the correct indexes
    with open('db/schema.sql', 'r') as f:
        schema = f.read()
        assert 'CREATE INDEX idx_menu_items_name ON menu_items (name)' in schema
        assert 'CREATE INDEX idx_reviews_text ON reviews (text)' in schema
        assert 'CREATE INDEX idx_orders_status ON orders (status)' in schema