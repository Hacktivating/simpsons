import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { sessionId, guestName } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: "Missing session ID" });
        }

        const booking = await queries.createBooking({
            userId,
            sessionId,
            guestName: guestName || null,
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: "Failed to create booking" });
    }
};

export const getBookingById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const booking = await queries.getBookingById(id);

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error("Error fetching booking by id:", error);
        res.status(500).json({ error: "Failed to fetch booking" });
    }
};

export const getBookingsBySessionId = async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params as { sessionId: string };
        const bookings = await queries.getBookingsBySessionId(sessionId);
        
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings by session:", error);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
};

export const getMyBookings = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const bookings = await queries.getBookingsByUserId(userId);
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ error: "Failed to fetch user bookings" });
    }
};

export const updateBookingPaymentStatus = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { id } = req.params as { id: string };
        const { paymentStatus } = req.body;

        const validStatuses = ["paid", "unpaid", "pending"];

        if (!paymentStatus || !validStatuses.includes(paymentStatus)) {
            return res.status(400).json({ error: "Invalid payment status" });
        }

        const updatedBooking = await queries.updateBookingPaymentStatus(id, paymentStatus);
        
        if (!updatedBooking) {
            return res.status(404).json({ error: "Booking not found or failed to update" });
        }

        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error("Error updating booking payment status:", error);
        res.status(500).json({ error: "Failed to update payment status" });
    }
};

export const deleteBooking = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { id } = req.params as { id: string };
        
        //Fetch booking first to verify ownership
        const booking = await queries.getBookingById(id);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        if (booking.userId !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const deletedBooking = await queries.deleteBooking(id);

        if (!deletedBooking) {
            return res.status(404).json({ error: "Booking not found or already deleted" });
        }

        res.status(200).json({ message: "Booking successfully deleted", booking: deletedBooking });
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ error: "Failed to delete booking" });
    }
};