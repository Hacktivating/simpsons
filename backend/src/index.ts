import express from "express";
import cors from "cors";

import { ENV } from "./config/env";
import { clerkMiddleware } from '@clerk/express'

import userRoutes from "./routes/userRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import matchRoutes from "./routes/matchRoutes";

const app = express();

app.use(cors({ origin: ENV.FRONTEND_URL }));
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Simpsons Badminton Community App API! - Powered by PostgreSQL, Drizzle ORM & Clerk Auth",
        endpoint: {
            users: "/api/users",
            sessions: "/api/sessions",
            bookings: "/api/bookings",
            matches: "/api/matches",
        },
    });
});

app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/matches", matchRoutes);

app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
});