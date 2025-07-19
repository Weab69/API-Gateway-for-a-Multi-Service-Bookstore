import { Response } from 'express';
import * as reviewService from '../services/reviewService';
import { IRequestWithUser } from '../../auth/types/auth.types';
import { Types } from 'mongoose';

export const addReview = async (req: IRequestWithUser, res: Response) => {
    const { bookId, rating, comment } = req.body;

    if (!req.user) {
        return res.status(401).json({message: `Unauthorized. Authenticated user not found.`});
    }

    req.user._id
    const userId = (req.user._id as Types.ObjectId).toString();
    if (!bookId || !rating || !comment) {
        return res.status(400).json({ message: 'Missing required review fields' });
    }
    const newReview = await reviewService.addReview(bookId, userId, rating, comment);
    res.status(201).json(newReview);
};

export const getReviews = (req: IRequestWithUser, res: Response) => {
    const bookId = req.params.id;
    const reviews = reviewService.getReviews(bookId);
    res.json(reviews);
};