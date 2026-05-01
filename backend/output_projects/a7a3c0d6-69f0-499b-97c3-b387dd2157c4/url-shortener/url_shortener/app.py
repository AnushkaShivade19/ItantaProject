from flask import Flask, jsonify
from url_shortener.links import create_link
app = Flask(__name__)

@app.route('/create_link', methods=['POST'])
def create_link_endpoint():
    original_url = 'https://example.com'
    alias = 'example'
    link = create_link(original_url, alias)
    return jsonify(link)