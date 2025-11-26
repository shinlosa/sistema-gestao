import { Router } from "express";
import { activityLogController } from "../controllers/activityLogController.js";
import { revisionRequestController } from "../controllers/revisionRequestController.js";
import { namiController } from "../controllers/namiController.js";
import { authenticate, requireRole } from "../middleware/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const namiRouter = Router();

namiRouter.use(authenticate);

namiRouter.get("/monitorings", asyncHandler(namiController.listMonitorings));
namiRouter.get("/rooms", asyncHandler(namiController.listRooms));
namiRouter.get("/rooms/:roomId", asyncHandler(namiController.getRoom));
namiRouter.get("/rooms/:roomId/bookings", asyncHandler(namiController.getBookingsByRoom));
namiRouter.get("/bookings", asyncHandler(namiController.listBookings));
namiRouter.get("/time-slots", asyncHandler(namiController.listTimeSlots));
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
	asyncHandler(revisionRequestController.approve),
);
namiRouter.post(
	"/revision-requests/:id/reject",
	requireRole(["admin"]),
	asyncHandler(revisionRequestController.reject),
);
namiRouter.post(
	"/bookings",
	requireRole(["admin", "editor", "usuario"]),
	asyncHandler(namiController.createBooking),
);
namiRouter.put(
	"/bookings/:bookingId",
	requireRole(["admin", "editor"]),
	asyncHandler(namiController.updateBooking),
);
namiRouter.delete(
	"/bookings/:bookingId",
	requireRole(["admin", "editor"]),
	asyncHandler(namiController.cancelBooking),
);

export { namiRouter };
