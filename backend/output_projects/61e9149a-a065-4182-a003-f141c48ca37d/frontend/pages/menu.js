class MenuPage {
    constructor() {}

    async get_menu_items() {
        const response = await fetch('/api/menu-items');
        const menuItems = await response.json();
        return menuItems;
    }
}

export { MenuPage };