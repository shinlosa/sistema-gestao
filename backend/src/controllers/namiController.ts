import { NextFunction, Request, Response } from "express";
import { bookingService } from "../services/bookingService.js";
import { createBookingSchema, updateBookingSchema } from "../schemas/bookingSchemas.js";
import { namiService } from "../services/namiService.js";

export const namiController = {
  listMonitorings: (_request: Request, response: Response) => response.json({ monitorings: namiService.listMonitorings() }),
  listRooms: (_request: Request, response: Response) => response.json({ rooms: namiService.listRooms() }),
  getRoom: (request: Request, response: Response) => {
    const room = namiService.getRoomById(request.params.roomId);

    if (!room) {
      return response.status(404).json({ message: "Sala não encontrada" });
    }

    return response.json({ room });
  },
  listBookings: (_request: Request, response: Response) => response.json({ bookings: namiService.listBookings() }),
  getBookingsByRoom: (request: Request, response: Response) => {
    const bookings = namiService.getBookingsByRoom(request.params.roomId);
    return response.json({ bookings });
  },
  listTimeSlots: (_request: Request, response: Response) => response.json({ timeSlots: namiService.listTimeSlots() }),
  createBooking: (request: Request, response: Response, next: NextFunction) => {
    const parseResult = createBookingSchema.safeParse(request.body);

    if (!parseResult.success) {
      const { fieldErrors } = parseResult.error.flatten();
      return response.status(400).json({
        message: "Dados inválidos",
        errors: fieldErrors,
      });
    }

    try {
      const actor = {
        id: request.user?.id ?? "",
        name: request.user?.name ?? "",
      };
      const booking = bookingService.createBooking(parseResult.data, actor);
      return response.status(201).json({ booking });
    } catch (error) {
      return next(error);
    }
  },
  updateBooking: (request: Request, response: Response, next: NextFunction) => {
    const parseResult = updateBookingSchema.safeParse(request.body);

    if (!parseResult.success) {
      const { fieldErrors } = parseResult.error.flatten();
      return response.status(400).json({
        message: "Dados inválidos",
        errors: fieldErrors,
      });
    }

    const { bookingId } = request.params;

    try {
      const actor = {
        id: request.user?.id ?? "",
        name: request.user?.name ?? "",
      };
      const booking = bookingService.updateBooking(bookingId, parseResult.data, actor);
      return response.status(200).json({ booking });
    } catch (error) {
      return next(error);
    }
  },
  cancelBooking: (request: Request, response: Response, next: NextFunction) => {
    const { bookingId } = request.params;

    try {
      const actor = {
        id: request.user?.id ?? "",
        name: request.user?.name ?? "",
      };
  void bookingService.cancelBooking(bookingId, actor);
      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  },
};
