def test_vercel_entrypoint_configured():
    with open('public/index.html') as f:
        content = f.read()
    # Verify Vercel entrypoint script tag exists
    assert '<script src="https://vercel.com/entrypoint.js"></script>' in content
    # Verify entrypoint container element exists
    assert '<div id="vercel-root"></div>' in content