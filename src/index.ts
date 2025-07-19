import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import bookRoutes from './modules/books/routes/bookRoutes';
import reviewRoutes from './modules/reviews/routes/reviewRoutes';
import authRoutes from './modules/auth/routes/authRoutes';
import { logger } from './utils/logger';
import { setupSwagger } from './docs/swagger';
import { configureJwtStrategy } from './modules/auth/strategies/jwtStrategy';

dotenv.config();

const mongoUri = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET

if(!mongoUri || !jwtSecret || !jwtRefreshSecret){
    throw new Error("Missing secret key")
}

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

configureJwtStrategy(passport);

mongoose.connect(mongoUri)
    .then(() => logger.info('MongoDB connected'))
    .catch(err => logger.error('MongoDB connection error:', err));

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/reviews', reviewRoutes);

setupSwagger(app);

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
