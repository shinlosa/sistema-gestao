import crypto from "node:crypto";
import { bookings as seedBookings } from "../../data/namiData.js";
import { NAMIBooking } from "../../types/nami.js";
import { BookingRepository } from "../bookingRepository.js";

const cloneBooking = (booking: NAMIBooking): NAMIBooking => ({
  ...booking,
  timeSlots: [...booking.timeSlots],
});

export class InMemoryBookingRepository implements BookingRepository {
  private bookings: NAMIBooking[] = seedBookings.map((booking) => cloneBooking(booking));

  list(): NAMIBooking[] {
    return this.bookings.map((booking) => cloneBooking(booking));
  }

  listByRoom(roomId: string): NAMIBooking[] {
    return this.bookings.filter((booking) => booking.roomId === roomId).map((booking) => cloneBooking(booking));
  }

  listByRoomAndDate(roomId: string, date: string): NAMIBooking[] {
    return this.bookings
      .filter((booking) => booking.roomId === roomId && booking.date === date)
      .map((booking) => cloneBooking(booking));
  }

  findById(id: string): NAMIBooking | undefined {
    const booking = this.bookings.find((candidate) => candidate.id === id);
    return booking ? cloneBooking(booking) : undefined;
  }

  create(booking: NAMIBooking): NAMIBooking {
    const bookingWithId = booking.id ? booking : { ...booking, id: crypto.randomUUID() };
    this.bookings.push(cloneBooking(bookingWithId));
    return cloneBooking(bookingWithId);
  }

  update(booking: NAMIBooking): NAMIBooking {
    const index = this.bookings.findIndex((candidate) => candidate.id === booking.id);
    if (index === -1) {
      throw new Error(`Booking with id ${booking.id} not found`);
    }

    this.bookings[index] = cloneBooking(booking);
    return cloneBooking(this.bookings[index]);
  }

  delete(id: string): void {
    this.bookings = this.bookings.filter((booking) => booking.id !== id);
  }
}
