class Review {
    constructor() {}
    display_review(review_text, review_rating) {
        if (review_text === null || review_text === undefined || review_rating === null || review_rating === undefined) {
            throw new Error('Invalid input');
        }
        console.log(`Review: ${review_text}, Rating: ${review_rating}`);
    }
}
export { Review };