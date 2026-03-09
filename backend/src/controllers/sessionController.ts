import type { Request, Response } from "express";

import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

//Get All Sessions (PUBLIC)
export const getAllSessions = async (req: Request, res: Response) => {
    try {
        const sessions = await queries.getAllSessions();
        res.status(200).json(sessions);
    } catch (error) {
        console.error("Error fetching sessions:", error);
        res.status(500).json({ error: "Failed to fetch sessions" });
    }
};

//Get Session by ID (PUBLIC)
export const getSessionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const session = await queries.getSessionById(id);

        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }
        res.status(200).json(session);
    } catch (error) {
        console.error("Error fetching session by id:", error);
        res.status(500).json({ error: "Failed to fetch session" });
    }
};

//Create Session (PROTECTED)
export const createSession = async (req: Request, res: Response) => {
    try {
        const { date, startTime, endTime, location, field, price, maxSlots, status } = req.body;

        if (!date || !location || !field || !status || !maxSlots || !price || !startTime || !endTime) {
            return res.status(400).json({ error: "Missing required session fields" });
        }

        const session = await queries.createSession({
            date,
            startTime,
            endTime,
            location,
            field,
            price,
            maxSlots,
            status,
        });
        
        res.status(201).json(session);
    } catch (error) {
        console.error("Error creating session:", error);
        res.status(500).json({ error: "Failed to create session" });
    }
};

export const getUpcomingSessions = async (req: Request, res: Response) => {
    try {
        const sessions = await queries.getUpcomingSessions();
        res.status(200).json(sessions);
    } catch (error) {
        console.error("Error fetching upcoming sessions:", error);
        res.status(500).json({ error: "Failed to fetch upcoming sessions" });
    }
};

export const updateSession = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const updateData = req.body;

        const updatedSession = await queries.updateSession(id, updateData);
        
        if (!updatedSession) {
            return res.status(404).json({ error: "Session not found or failed to update" });
        }

        res.status(200).json(updatedSession);
    } catch (error) {
        console.error("Error updating session:", error);
        res.status(500).json({ error: "Failed to update session" });
    }
};

export const deleteSession = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const deletedSession = await queries.deleteSession(id);

        if (!deletedSession) {
            return res.status(404).json({ error: "Session not found or already deleted" });
        }

        res.status(200).json({ message: "Session successfully deleted", session: deletedSession });
    } catch (error) {
        console.error("Error deleting session:", error);
        res.status(500).json({ error: "Failed to delete session" });
    }
};