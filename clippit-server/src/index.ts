import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
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
}));
app.use(helmet());
app.use(morgan('dev'));

// webhook route before express.json
app.use(authRoutes);

app.use(express.json());

app.use("/api/items", itemRoutes);
app.use("/api", searchRouter);
app.use("/api/collections", collectionRouters);
app.use("/api/invites", invitesRouters);
app.use("/api/user", userRouter);

app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

app.use(errorHandler);

const startServer = async () => {
    await connectToDb();
    await connectRedis();
    await import('./jobs/embedding.worker');

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();

export default app;