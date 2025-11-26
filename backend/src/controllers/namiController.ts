import { NextFunction, Request, Response } from "express";
import { bookingService } from "../services/bookingService.js";
import { createBookingSchema, updateBookingSchema } from "../schemas/bookingSchemas.js";
import { namiService } from "../services/namiService.js";

export const namiController = {
  listMonitorings: async (_request: Request, response: Response) => {
    const monitorings = await namiService.listMonitorings();
    return response.json({ monitorings });
  },
  listRooms: async (request: Request, response: Response) => {
    const page = Math.max(1, Number(request.query.page ?? 1));
    const perPage = Math.max(1, Math.min(100, Number(request.query.perPage ?? 20)));

    const all = await namiService.listRooms();
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const offset = (page - 1) * perPage;
    const rooms = all.slice(offset, offset + perPage);

    return response.json({ rooms, meta: { total, page, perPage, totalPages } });
  },
  getRoom: async (request: Request, response: Response) => {
    const room = await namiService.getRoomById(request.params.roomId);

    if (!room) {
      return response.status(404).json({ message: "Sala não encontrada" });
    }

    return response.json({ room });
  },
  listBookings: async (request: Request, response: Response) => {
    const page = Math.max(1, Number(request.query.page ?? 1));
    const perPage = Math.max(1, Math.min(100, Number(request.query.perPage ?? 20)));

    const all = await namiService.listBookings();
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const offset = (page - 1) * perPage;
    const bookings = all.slice(offset, offset + perPage);

    return response.json({ bookings, meta: { total, page, perPage, totalPages } });
  },
  getBookingsByRoom: async (request: Request, response: Response) => {
    const bookings = await namiService.getBookingsByRoom(request.params.roomId);
    return response.json({ bookings });
  },
  listTimeSlots: async (_request: Request, response: Response) => {
    const timeSlots = await namiService.listTimeSlots();
    return response.json({ timeSlots });
  },
  createBooking: async (request: Request, response: Response, next: NextFunction) => {
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
      const booking = await bookingService.createBooking(parseResult.data, actor);
      return response.status(201).json({ booking });
    } catch (error) {
      return next(error);
    }
  },
  updateBooking: async (request: Request, response: Response, next: NextFunction) => {
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
      const booking = await bookingService.updateBooking(bookingId, parseResult.data, actor);
      return response.status(200).json({ booking });
    } catch (error) {
      return next(error);
    }
  },
  cancelBooking: async (request: Request, response: Response, next: NextFunction) => {
    const { bookingId } = request.params;

    try {
      const actor = {
        id: request.user?.id ?? "",
        name: request.user?.name ?? "",
      };
      await bookingService.cancelBooking(bookingId, actor);
      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  },
};
