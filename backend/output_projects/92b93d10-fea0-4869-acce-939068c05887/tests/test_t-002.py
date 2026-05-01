# Test module for database connection and operations.

import pytest
from backend.database import create_connection, create_table, drop_table
from unittest.mock import patch

@pytest.fixture
def mock_db_connection():
    with patch('backend.database.sqlite3') as mock_sqlite3:
        yield mock_sqlite3

def test_create_connection(mock_db_connection):
    # Test that a connection to the database is established successfully.
    conn = create_connection()
    assert conn is not None

def test_create_table(mock_db_connection):
    # Test that a table is created in the database.
    conn = create_connection()
    create_table(conn)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    assert ('bookmarks',) in tables

def test_drop_table(mock_db_connection):
    # Test that a table is dropped from the database.
    conn = create_connection()
    create_table(conn)
    drop_table(conn)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    assert ('bookmarks',) not in tables

def test_create_table_with_invalid_connection(mock_db_connection):
    # Test that creating a table with an invalid connection raises an error.
    with pytest.raises(Exception):
        create_table(None)