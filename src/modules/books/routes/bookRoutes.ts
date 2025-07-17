import { Router } from 'express';
import { searchBooks } from '../controllers/bookController';
import { getReviews } from '../../reviews/controllers/reviewController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 */

/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Search for books by query
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query for books
 *     responses:
 *       200:
 *         description: A list of books matching the query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   authors:
 *                     type: array
 *                     items:
 *                       type: string
 *                   description:
 *                     type: string
 *                   isbn:
 *                     type: array
 *                     items:
 *                       type: string
 *                   cover_image:
 *                     type: string
 *       400:
 *         description: Search query is required
 *       500:
 *         description: Error fetching book data
 */
router.get('/search', searchBooks);

/**
 * @swagger
 * /books/{id}/reviews:
 *   get:
 *     summary: Get all reviews for a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book ID
 *     responses:
 *       200:
 *         description: A list of reviews for the book
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   reviewId:
 *                     type: string
 *                   bookId:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   rating:
 *                     type: number
 *                   comment:
 *                     type: string
 */
router.get('/:id/reviews', getReviews);

export default router;
