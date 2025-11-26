import { NAMIBooking } from "../types/nami.js";

export interface BookingRepository {
  list(): Promise<NAMIBooking[]>;
  listByRoom(roomId: string): Promise<NAMIBooking[]>;
  listByRoomAndDate(roomId: string, date: string): Promise<NAMIBooking[]>;
  listByDateRange(startDate: string, endDate: string): Promise<NAMIBooking[]>;
  findById(id: string): Promise<NAMIBooking | undefined>;
  checkConflict(roomId: string, date: string, timeSlots: string[], excludeBookingId?: string): Promise<boolean>;
  create(booking: NAMIBooking): Promise<NAMIBooking>;
  update(booking: NAMIBooking): Promise<NAMIBooking>;
  delete(id: string): Promise<void>;
  cancel(id: string): Promise<void>;
}
