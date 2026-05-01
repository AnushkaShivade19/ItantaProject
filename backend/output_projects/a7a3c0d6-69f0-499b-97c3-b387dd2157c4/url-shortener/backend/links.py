import uuid
from datetime import datetime
db = {}

def create_short_url(long_url, alias=None):
    if alias is None:
        alias = str(uuid.uuid4())[:6]
    short_url = f'http://example.com/{alias}'
    link_id = str(uuid.uuid4())
    db[link_id] = {'id': link_id, 'long_url': long_url, 'alias': alias, 'short_url': short_url, 'hit_count': 0, 'created_at': datetime.now()}
    return db[link_id]

def get_link(alias):
    for link_id, link in db.items():
        if link['alias'] == alias:
            return link
    return None

def get_link_stats(alias):
    link = get_link(alias)
    if link:
        return link
    return None