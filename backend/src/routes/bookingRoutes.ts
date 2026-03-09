import { Router } from "express";
import { requireAuth } from "@clerk/express";
import * as bookingController from "../controllers/bookingController";

const router = Router();

// Rute untuk melihat pendaftar di sebuah sesi (Bisa diakses publik atau butuh auth)
router.get("/session/:sessionId", bookingController.getBookingsBySessionId);

// Semua rute di bawah ini mewajibkan pengguna untuk login (terautentikasi)
router.use(requireAuth());

router.post("/", bookingController.createBooking);
router.get("/me", bookingController.getMyBookings); // Harus diletakkan sebelum /:id agar tidak dianggap sebagai parameter id
router.get("/:id", bookingController.getBookingById);
router.patch("/:id/payment", bookingController.updateBookingPaymentStatus);
router.delete("/:id", bookingController.deleteBooking);

export default router;