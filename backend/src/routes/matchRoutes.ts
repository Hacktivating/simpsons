import { Router } from "express";
import { requireAuth } from "@clerk/express";
import * as matchController from "../controllers/matchController";

const router = Router();

// Rute publik atau dapat disesuaikan untuk melihat riwayat pertandingan suatu sesi
router.get("/session/:sessionId", matchController.getMatchesBySessionId);

// Rute yang membutuhkan autentikasi
router.use(requireAuth());

router.post("/", matchController.createMatch);
router.get("/me", matchController.getMyMatches);
router.delete("/:id", matchController.deleteMatch);

export default router;