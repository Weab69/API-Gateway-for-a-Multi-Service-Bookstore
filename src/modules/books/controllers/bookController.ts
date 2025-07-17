import { Request, Response } from 'express';
import * as bookService from '../services/bookService';

export const searchBooks = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        const books = await bookService.searchBooks(query);
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book data' });
    }
};
