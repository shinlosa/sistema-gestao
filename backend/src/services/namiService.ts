import { bookings, monitorings, namiRooms, timeSlots } from "../data/namiData.js";
import { NAMIBooking, NAMIRoom } from "../types/nami.js";

export const namiService = {
  listTimeSlots: () => timeSlots,
  listMonitorings: () => monitorings,
  listRooms: () => namiRooms,
  getRoomById: (roomId: string): NAMIRoom | undefined => namiRooms.find((room) => room.id === roomId),
  listBookings: () => bookings,
  getBookingsByRoom: (roomId: string): NAMIBooking[] => bookings.filter((booking) => booking.roomId === roomId),
};
