export function createOrder(items) {
    if (items.length === 0) {
        throw new Error('Items list cannot be empty');
    }
    for (const item of items) {
        if (!item.id || !item.name || !item.quantity) {
            throw new Error('Invalid item: id, name, and quantity are required');
        }
    }
    // Simulate API call to create an order
    return new Promise((resolve) => {
        resolve({ id: '1234', status: 'pending' });
    });
}