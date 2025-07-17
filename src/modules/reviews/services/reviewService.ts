import { Review } from '../types/review.types';

const reviews: Review[] = [];

export const addReview = (bookId: string, userId: string, rating: number, comment: string): Review => {
    const newReview: Review = {
        reviewId: `rev_${Date.now()}_${Math.random()}`,
        bookId,
        userId,
        rating,
        comment
    };
    reviews.push(newReview);
    return newReview;
};

export const getReviews = (bookId: string): Review[] => {
    return reviews.filter(review => review.bookId === bookId);
};
