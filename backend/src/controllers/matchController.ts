import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

export const createMatch = async (req: Request, res: Response) => {
    try {
        const { sessionId, winnerId, loserId, score } = req.body;

        if (!sessionId || !winnerId || !loserId || !score) {
            return res.status(400).json({ error: "Missing required match fields" });
        }

        if (winnerId === loserId) {
            return res.status(400).json({ error: "Winner and loser cannot be the same user" });
        }

        const match = await queries.createMatch({
            sessionId,
            winnerId,
            loserId,
            score,
        });

        res.status(201).json(match);
    } catch (error) {
        console.error("Error creating match:", error);
        res.status(500).json({ error: "Failed to create match" });
    }
};

export const getMatchesBySessionId = async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params as { sessionId: string };
        const matches = await queries.getMatchesBySessionId(sessionId);
        
        res.status(200).json(matches);
    } catch (error) {
        console.error("Error fetching matches by session:", error);
        res.status(500).json({ error: "Failed to fetch matches" });
    }
};

export const getMyMatches = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const matches = await queries.getMatchesByUserId(userId);
        res.status(200).json(matches);
    } catch (error) {
        console.error("Error fetching user matches:", error);
        res.status(500).json({ error: "Failed to fetch user matches" });
    }
};

export const deleteMatch = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const deletedMatch = await queries.deleteMatch(id);

        if (!deletedMatch) {
            return res.status(404).json({ error: "Match not found or already deleted" });
        }

        res.status(200).json({ message: "Match successfully deleted", match: deletedMatch });
    } catch (error) {
        console.error("Error deleting match:", error);
        res.status(500).json({ error: "Failed to delete match" });
    }
};