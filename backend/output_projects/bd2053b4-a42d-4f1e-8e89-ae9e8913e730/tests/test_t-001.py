# Test the database schema creation for the bookmarks table.

import pytest
from models.bookmark import Bookmark
import sqlite3

@pytest.fixture
def db_connection():
    return sqlite3.connect('database/pinit.db')

def test_bookmark_table_exists(db_connection):
    cursor = db_connection.cursor()
    cursor.execute("""SELECT name 
                      FROM sqlite_master 
                      WHERE type='table' AND name='bookmarks';""")
    result = cursor.fetchone()
    assert result is not None

def test_bookmark_table_fields(db_connection):
    cursor = db_connection.cursor()
    cursor.execute("""PRAGMA table_info(bookmarks);""")
    fields = cursor.fetchall()
    field_names = [field[1] for field in fields]
    assert 'id' in field_names
    assert 'url' in field_names
    assert 'title' in field_names

def test_bookmark_table_constraints(db_connection):
    cursor = db_connection.cursor()
    cursor.execute("""PRAGMA table_info(bookmarks);""")
    fields = cursor.fetchall()
    id_field = next((field for field in fields if field[1] == 'id'), None)
    url_field = next((field for field in fields if field[1] == 'url'), None)
    title_field = next((field for field in fields if field[1] == 'title'), None)
    assert id_field[5] == 1  # id is primary key
    assert url_field[3] == 1  # url is not null
    assert title_field[3] == 1  # title is not null

def test_bookmark_table_index(db_connection):
    cursor = db_connection.cursor()
    cursor.execute("""PRAGMA index_list(bookmarks);""")
    indexes = cursor.fetchall()
    index_names = [index[1] for index in indexes]
    assert 'title' in index_names