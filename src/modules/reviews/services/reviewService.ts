import { CREATE_REVIEWS_PATTERN } from "../../../utils/patterns";
import { publishMessage } from "../../../utils/rabbitmq";
import { Review } from "../types/review.types";

const reviews: Review[] = [];

export const addReview = async (
  bookId: string,
  userId: string,
  rating: number,
  comment: string
): Promise<Review> => {
  const newReview: Review = {
    reviewId: `rev_${Date.now()}_${Math.random()}`,
    bookId,
    userId,
    rating,
    comment,
  };
  publishMessage("reviews", CREATE_REVIEWS_PATTERN, newReview);
  reviews.push(newReview);
  return newReview;
};

export const getReviews = (bookId: string): Review[] => {
  return reviews.filter((review) => review.bookId === bookId);
};
