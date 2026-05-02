"""
Test that the project structure is created correctly.
"""
import pytest
from pathlib import Path

def test_root_directory_exists():
    assert Path('7th-heaven-bakery').exists(), 'Root directory missing'

def test_public_directory_exists():
    assert Path('7th-heaven-bakery/public').exists(), 'Public directory missing'

def test_src_structure_exists():
    assert Path('7th-heaven-bakery/src').exists(), 'Src directory missing'
    assert Path('7th-heaven-bakery/src/components').exists(), 'Components directory missing'

def test_core_files_exist():
    assert Path('7th-heaven-bakery/src/App.js').exists(), 'App.js missing'
    assert Path('7th-heaven-bakery/src/index.js').exists(), 'index.js missing'
    assert Path('7th-heaven-bakery/README.md').exists(), 'README.md missing'