import {
    publishMessage,
    requestResponse,
    REVIEW_QUEUE,
    sendRpc,
  } from "../../../utils/rabbitmq";
  import {
    CREATE_REVIEWS_PATTERN,
    BOOK_REVIEWS_PATTERN,
    ALL_REVIEWS_PATTERN,
  } from "../types/review.constants";
  import { Review } from "../types/review.types";
 
  export const addReview = (
    bookId: string,
    userId: string,
    rating: number,
    comment: string
  ): void => {
    const reviewPayload = { bookId, userId, rating, comment };
  
    publishMessage(REVIEW_QUEUE, CREATE_REVIEWS_PATTERN, reviewPayload);
  
    console.log("Sent review creation event for book:", bookId);
  };
  
  export const getAllReviews = async () => {
    return await sendRpc(ALL_REVIEWS_PATTERN, {});
  };
  
  
  export const getReviews = (bookId: string): Promise<Review[]> => {
    const payload = { bookId };
    return sendRpc(BOOK_REVIEWS_PATTERN, payload);
  };
  