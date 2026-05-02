import axios from 'axios';

class HomePage {
    constructor() {}

    async get_menu_items() {
        try {
            const response = await axios.get('/api/menu');
            return response.data.items;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async get_reviews() {
        try {
            const response = await axios.get('/api/reviews');
            return response.data.items;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}
export { HomePage };