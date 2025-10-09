import { Router } from "express";
import { namiController } from "../controllers/namiController.js";

const namiRouter = Router();

namiRouter.get("/monitorings", namiController.listMonitorings);
namiRouter.get("/rooms", namiController.listRooms);
namiRouter.get("/rooms/:roomId", namiController.getRoom);
namiRouter.get("/rooms/:roomId/bookings", namiController.getBookingsByRoom);
namiRouter.get("/bookings", namiController.listBookings);
namiRouter.get("/time-slots", namiController.listTimeSlots);

export { namiRouter };
