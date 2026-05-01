from flask import Flask, request, jsonify, redirect, url_for
from uuid import uuid4
from datetime import datetime
from url_shortener.backend.links import get_link, create_link, update_link

app = Flask(__name__)

@app.route('/api/links', methods=['POST'])
def create_shortened_url():
    data = request.get_json()
    long_url = data['long_url']
    alias = data['alias']
    link_id = str(uuid4())
    create_link(link_id, long_url, alias)
    return jsonify({'id': link_id, 'alias': alias, 'short_url': f'{request.url_root}api/links/{alias}'}), 201

@app.route('/api/links/<alias>', methods=['GET'])
def redirect_to_original_link(alias):
    link = get_link(alias)
    if link:
        update_link(link['id'], link['long_url'], link['alias'], link['hit_count'] + 1)
        return redirect(link['long_url'], code=302)
    return jsonify({'error': 'Link not found'}), 404

@app.route('/api/links/<alias>/stats', methods=['GET'])
def retrieve_hit_count_analytics(alias):
    link = get_link(alias)
    if link:
        return jsonify({'id': link['id'], 'long_url': link['long_url'], 'hit_count': link['hit_count'], 'created_at': link['created_at']})
    return jsonify({'error': 'Link not found'}), 404