import { Request, Response } from "express";
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
};
