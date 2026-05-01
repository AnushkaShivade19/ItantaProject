# Test the database connection utility.

import pytest
from backend.utils.database import connect_to_database
from unittest.mock import patch

def test_connect_to_database_success():
    # Arrange
    # Act
    connection = connect_to_database()
    # Assert
    assert connection is not None

def test_connect_to_database_failure():
    # Arrange
    with patch('backend.utils.database.connect_to_database', side_effect=Exception('Mocked connection error')):
        # Act and Assert
        with pytest.raises(Exception):
            connect_to_database()

def test_connect_to_database_multiple_times():
    # Arrange
    # Act
    connection1 = connect_to_database()
    connection2 = connect_to_database()
    # Assert
    assert connection1 is not None
    assert connection2 is not None
    assert connection1 == connection2