# Test the project structure setup
"""Tests for the project structure setup"""

import pytest
import os
from url_shortener import links

@pytest.fixture
def mock_project_dir(tmp_path):
    # Create a temporary project directory
    project_dir = tmp_path / 'url_shortener'
    project_dir.mkdir()
    yield project_dir

def test_project_structure_setup(mock_project_dir):
    # Check if the project directory is created
    assert os.path.exists(mock_project_dir)

    # Check if the required files are created
    assert os.path.exists(mock_project_dir / 'README.md')
    assert os.path.exists(mock_project_dir / 'requirements.txt')
    assert os.path.exists(mock_project_dir / 'docker-compose.yml')

def test_links_module_exists(mock_project_dir):
    # Check if the links module exists
    assert hasattr(links, 'create_link')

def test_links_module_create_link(mock_project_dir):
    # Test the create_link function
    link = links.create_link('https://example.com', 'example')
    assert link['id'] is not None
    assert link['alias'] == 'example'
    assert link['short_url'] is not None