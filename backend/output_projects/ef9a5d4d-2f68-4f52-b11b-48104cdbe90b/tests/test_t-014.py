# Test the creation of package.json with project metadata
import json
import os
from pathlib import Path
import pytest

def test_package_json_exists():