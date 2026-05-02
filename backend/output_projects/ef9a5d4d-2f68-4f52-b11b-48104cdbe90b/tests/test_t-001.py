# Test the creation of the project directory with the correct folder structure.

import os
import pytest
from pathlib import Path

def test_project_directory_created():
    # Arrange and Act
    project_dir = Path('7th-heaven-bakery')
    
    # Assert
    assert project_dir.exists()
    assert project_dir.is_dir()

def test_project_directory_structure():
    # Arrange and Act
    project_dir = Path('7th-heaven-bakery')
    
    # Assert
    assert (project_dir / 'src').exists()
    assert (project_dir / 'src').is_dir()
    assert (project_dir / 'tests').exists()
    assert (project_dir / 'tests').is_dir()
    assert (project_dir / 'README.md').exists()
    assert (project_dir / 'README.md').is_file()

def test_project_directory_creation_fails_if_exists():
    # Arrange
    project_dir = Path('7th-heaven-bakery')
    project_dir.mkdir(parents=True, exist_ok=True)
    
    # Act and Assert
    with pytest.raises(FileExistsError):
        # This should raise an error if the directory already exists
        project_dir.mkdir(parents=True)