import { NAMIBooking } from "../types/nami.js";

export interface BookingRepository {
  list(): NAMIBooking[];
  listByRoom(roomId: string): NAMIBooking[];
  listByRoomAndDate(roomId: string, date: string): NAMIBooking[];
  findById(id: string): NAMIBooking | undefined;
  create(booking: NAMIBooking): NAMIBooking;
  update(booking: NAMIBooking): NAMIBooking;
  delete(id: string): void;
}
