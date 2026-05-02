class ReviewsPage {
    constructor() {}
    
    async get_reviews() {
        try {
            const response = await fetch('/api/reviews');
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}

export { ReviewsPage };