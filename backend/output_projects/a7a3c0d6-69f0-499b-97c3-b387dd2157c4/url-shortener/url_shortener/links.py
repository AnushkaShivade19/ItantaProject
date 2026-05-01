import uuid
from flask import Flask, jsonify
app = Flask(__name__)

links = {}

def create_link(original_url, alias):
    link_id = str(uuid.uuid4())
    short_url = f'http://localhost:5000/{alias}'
    links[link_id] = {'original_url': original_url, 'alias': alias, 'short_url': short_url}
    return {'id': link_id, 'alias': alias, 'short_url': short_url}