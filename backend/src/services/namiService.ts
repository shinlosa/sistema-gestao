import { bookingRepository, monitoringRepository, roomRepository, timeSlotRepository } from "../repositories/index.js";
import { NAMIBooking, NAMIRoom, TimeSlot, Monitoring } from "../types/nami.js";

export const namiService = {
  listTimeSlots: async (): Promise<TimeSlot[]> => await timeSlotRepository.list(),
  listMonitorings: async (): Promise<Monitoring[]> => await monitoringRepository.list(),
  listRooms: async (): Promise<NAMIRoom[]> => await roomRepository.list(),
  getRoomById: async (roomId: string): Promise<NAMIRoom | undefined> => await roomRepository.findById(roomId),
  listBookings: async (): Promise<NAMIBooking[]> => await bookingRepository.list(),
  getBookingsByRoom: async (roomId: string): Promise<NAMIBooking[]> => await bookingRepository.listByRoom(roomId),
};
