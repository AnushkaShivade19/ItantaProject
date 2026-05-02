def test_project_structure_exists():
    required_paths = [
        'README.md',
        'public/index.html',
        'src/components/',
        'src/pages/',
        'src/styles/',
        'src/utils/',
    ]
    for path in required_paths:
        if path.endswith('/'):
            assert Path(path).is_dir(), f"Directory {path} does not exist"
        else:
            assert Path(path).is_file(), f"File {path} does not exist"