import { Router } from 'express';
import { addReview } from '../controllers/reviewController';

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - userId
 *               - rating
 *               - comment
 *             properties:
 *               bookId:
 *                 type: string
 *               userId:
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
 */
router.post('/', addReview);

export default router;
