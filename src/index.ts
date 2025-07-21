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
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { Request } from 'express';
import cors from 'cors';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

dotenv.config();

const mongoUri = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET

if(!mongoUri || !jwtSecret || !jwtRefreshSecret){
    throw new Error("Missing secret key")
}

const app = express();
const port = process.env.PORT || 8000;

// Apply global middleware
app.use(cors());
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

// Setup REST routes
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/reviews', reviewRoutes);

async function startServer() {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    // Setup GraphQL endpoint
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req: _req }: { req: Request }) => ({}),
    }));

    setupSwagger(app);

    app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
        logger.info(`GraphQL endpoint available at http://localhost:${port}/graphql`);
    });
}

startServer();
