import { Router } from "express";
import { activityLogController } from "../controllers/activityLogController.js";
import { revisionRequestController } from "../controllers/revisionRequestController.js";
import { namiController } from "../controllers/namiController.js";
import { authenticate, requireRole } from "../middleware/index.js";

const namiRouter = Router();

namiRouter.use(authenticate);

namiRouter.get("/monitorings", namiController.listMonitorings);
namiRouter.get("/rooms", namiController.listRooms);
namiRouter.get("/rooms/:roomId", namiController.getRoom);
namiRouter.get("/rooms/:roomId/bookings", namiController.getBookingsByRoom);
namiRouter.get("/bookings", namiController.listBookings);
namiRouter.get("/time-slots", namiController.listTimeSlots);
namiRouter.get(
  "/activity-logs",
  requireRole(["admin", "editor"]),
  activityLogController.list,
);
namiRouter.get(
	"/revision-requests",
	requireRole(["admin", "editor"]),
	revisionRequestController.list,
);
namiRouter.post(
	"/revision-requests",
	requireRole(["admin", "editor", "usuario"]),
	revisionRequestController.create,
);
namiRouter.post(
	"/revision-requests/:id/approve",
	requireRole(["admin"]),
	revisionRequestController.approve,
);
namiRouter.post(
	"/revision-requests/:id/reject",
	requireRole(["admin"]),
	revisionRequestController.reject,
);
namiRouter.post(
	"/bookings",
	requireRole(["admin", "editor", "usuario"]),
	namiController.createBooking,
);
namiRouter.put(
	"/bookings/:bookingId",
	requireRole(["admin", "editor"]),
	namiController.updateBooking,
);
namiRouter.delete(
	"/bookings/:bookingId",
	requireRole(["admin", "editor"]),
	namiController.cancelBooking,
);

export { namiRouter };
