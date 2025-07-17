import { Request, Response } from 'express';
import * as reviewService from '../services/reviewService';

export const addReview = (req: Request, res: Response) => {
    const { bookId, userId, rating, comment } = req.body;
    if (!bookId || !userId || !rating || !comment) {
        return res.status(400).json({ message: 'Missing required review fields' });
    }
    const newReview = reviewService.addReview(bookId, userId, rating, comment);
    res.status(201).json(newReview);
};

export const getReviews = (req: Request, res: Response) => {
    const bookId = req.params.id;
    const reviews = reviewService.getReviews(bookId);
    res.json(reviews);
};
