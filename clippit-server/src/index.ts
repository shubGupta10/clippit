import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectToDb from "./lib/db";
import { connectRedis } from "./config/redis";
import authRoutes from "./routes/auth/auth.router";
import { errorHandler } from "./lib/errorHandler";
import searchRouter from "./routes/search/search.router"
import itemRoutes from "./routes/item/item.router"
import collectionRouters from "./routes/collection/collection.router"
import invitesRouters from "./routes/invites/invites.router"
import userRouter from "./routes/user/user.router"

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet());
app.use(morgan('dev'));

// Global rate limit: 100 requests per 15 minutes per IP
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
}));

// webhook route before express.json
app.use(authRoutes);

app.use(express.json({ limit: '1mb' }));

app.use("/api/items", itemRoutes);
// Stricter rate limit for search (costs Gemini API tokens)
const searchLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { success: false, message: 'Search rate limit exceeded. Try again in a minute.' },
});
app.use("/api", searchLimiter, searchRouter);
app.use("/api/collections", collectionRouters);
app.use("/api/invites", invitesRouters);
app.use("/api/user", userRouter);

app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

app.use(errorHandler);

const startServer = async () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    await Promise.all([
        connectToDb(),
        connectRedis()
    ]);

    import('./jobs/embedding.worker').catch(err => {
        console.error('Failed to start embedding worker:', err);
    });
};

startServer();

export default app;