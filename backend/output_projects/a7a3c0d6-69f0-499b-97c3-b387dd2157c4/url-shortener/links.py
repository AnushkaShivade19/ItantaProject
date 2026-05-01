import uuid
import hashlib

def create_link(original_url, alias):
    link_id = str(uuid.uuid4())
    short_url = f'http://example.com/{alias}'
    return {'id': link_id, 'alias': alias, 'short_url': short_url, 'original_url': original_url}