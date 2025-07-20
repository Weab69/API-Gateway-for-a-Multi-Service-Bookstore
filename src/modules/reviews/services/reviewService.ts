import { publishMessage, requestResponse } from '../../../utils/rabbitmq';
import { 
    CREATE_REVIEWS_PATTERN, 
    BOOK_REVIEWS_PATTERN, 
    ALL_REVIEWS_PATTERN
} from '../../../utils/patterns';
import { Review } from '../types/review.types';

const REVIEW_QUEUE = 'reviews';

/**
 * Sends a review creation event to the reviews microservice.
 * This is a "fire-and-forget" operation corresponding to an @EventPattern.
 */
export const addReview = (bookId: string, userId: string, rating: number, comment: string): void => {
    const reviewPayload = { bookId, userId, rating, comment };
    
    // Use publishMessage for events that don't need a response.
    publishMessage(REVIEW_QUEUE, CREATE_REVIEWS_PATTERN, reviewPayload);
    
    console.log('Sent review creation event for book:', bookId);
};

export const getAllReviews = () => {
    return requestResponse(REVIEW_QUEUE, ALL_REVIEWS_PATTERN, undefined);
}

/**
 * Fetches all reviews for a specific book from the reviews microservice.
 * This is a "request-response" operation corresponding to a @MessagePattern.
 * @returns A Promise that resolves to an array of reviews.
 */
export const getReviews = (bookId: string): Promise<Review[]> => {
    const payload = { bookId };

    // Use requestResponse for messages that require a response from the microservice.
    return requestResponse(REVIEW_QUEUE, BOOK_REVIEWS_PATTERN, payload);
};
