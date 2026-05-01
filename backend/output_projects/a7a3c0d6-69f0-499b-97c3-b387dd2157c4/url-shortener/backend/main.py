from flask import Flask, jsonify, request
from url_shortener.backend.links import get_link, get_link_stats, update_link_hit_count

app = Flask(__name__)

@app.route('/api/links/<string:alias>', methods=['GET'])
def get_link_info(alias):
    link = get_link(alias)
    if link is None:
        return jsonify({}), 404
    update_link_hit_count(link['id'])
    return jsonify(link)

@app.route('/api/links/<string:alias>/stats', methods=['GET'])
def get_link_stats_info(alias):
    link_stats = get_link_stats(alias)
    if link_stats is None:
        return jsonify({}), 404
    return jsonify(link_stats)
