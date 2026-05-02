def test_globals_css_file_exists():
    path = Path('src/styles/globals.css')
    assert path.exists(), 'globals.css file should exist'

def test_globals_css_contains_global_styles():
    path = Path('src/styles/globals.css')
    content = path.read_text()
    assert 'html' in content, 'Should contain global html styles'
    assert 'body' in content, 'Should contain global body styles'
    assert '*' in content, 'Should contain universal selector styles'