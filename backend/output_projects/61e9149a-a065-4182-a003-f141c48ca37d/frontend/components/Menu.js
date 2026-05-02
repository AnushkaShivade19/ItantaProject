class Menu {
    constructor(items) {
        if (!Array.isArray(items)) {
            throw new TypeError('Invalid input. Expected an array of menu items.');
        }
        this.items = items;
    }

    display() {
        console.log('Displaying menu items:');
        this.items.forEach(item => {
            console.log(`Item: ${item.name}, Price: ${item.price}`);
        });
    }
}
export { Menu };