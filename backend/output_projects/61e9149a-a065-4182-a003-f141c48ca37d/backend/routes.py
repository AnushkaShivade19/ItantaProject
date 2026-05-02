from flask import Flask, request, jsonify
from uuid import uuid4

app = Flask(__name__)

# In-memory storage for orders (replace with a database in a real application)
orders = {}

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    if not data or 'items' not in data:
        return jsonify({'error': 'Invalid request data'}), 400
    for item in data['items']:
        if 'id' not in item or 'name' not in item or 'quantity' not in item:
            return jsonify({'error': 'Invalid item data'}), 400
    order_id = str(uuid4())
    orders[order_id] = {'id': order_id, 'status': 'pending', 'items': data['items']}
    return jsonify({'id': order_id, 'status': 'pending'}), 201