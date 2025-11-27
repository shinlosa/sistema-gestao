import { bookingRepository, monitoringRepository, roomRepository, timeSlotRepository } from "../repositories/index.js";
import { NAMIBooking, NAMIRoom, TimeSlot, Monitoring } from "../types/nami.js";

export const namiService = {
  listTimeSlots: (): TimeSlot[] => timeSlotRepository.list(),
  listMonitorings: (): Monitoring[] => monitoringRepository.list(),
  listRooms: (): NAMIRoom[] => roomRepository.list(),
  getRoomById: (roomId: string): NAMIRoom | undefined => roomRepository.findById(roomId),
  listBookings: (): NAMIBooking[] => bookingRepository.list(),
  getBookingsByRoom: (roomId: string): NAMIBooking[] => bookingRepository.listByRoom(roomId),
};
