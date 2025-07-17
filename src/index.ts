import express, { Express, Request, Response } from "express";
import dotenv from "dotenv"
import bookRoutes from './modules/books/routes/bookRoutes';
import reviewRoutes from './modules/reviews/routes/reviewRoutes';
import { logger } from './utils/logger';
import { setupSwagger } from './docs/swagger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next()
})

app.use('/books', bookRoutes);
app.use('/reviews', reviewRoutes);

setupSwagger(app);

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
