import { Router } from 'express';
import passport from 'passport';
import { addReview, getAllReviews } from '../controllers/reviewController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: The reviews managing API
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - rating
 *               - comment
 *             properties:
 *               bookId:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: The review was successfully created
 *       400:
 *         description: Missing required review fields
 *       401:
 *         description: Unauthorized
 */
router.post('/', passport.authenticate('jwt', { session: false }), addReview);

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: A list of all reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   bookId:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   comment:
 *                     type: string
 *                   rating:
 *                     type: number
 */

router.get('/', getAllReviews);

export default router;
