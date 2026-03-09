import { Router } from "express";
import * as sessionController from "../controllers/sessionController";
import { requireAuth } from "@clerk/express";
import { createSession } from "../controllers/sessionController";

const router = Router();

// PUBLIC ROUTES
router.get("/upcoming", sessionController.getUpcomingSessions);
router.get("/", sessionController.getAllSessions);
router.get("/:id", sessionController.getSessionById);

// PROTECTED ROUTES
router.post("/", requireAuth(), sessionController.createSession);
router.patch("/:id", requireAuth(), sessionController.updateSession);
router.delete("/:id", requireAuth(), sessionController.deleteSession);

export default router;