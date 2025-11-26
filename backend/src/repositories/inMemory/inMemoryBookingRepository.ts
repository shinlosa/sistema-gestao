/* eslint-disable @typescript-eslint/require-await */
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

  async list(): Promise<NAMIBooking[]> {
    return this.bookings.filter((b) => b.status !== "cancelled").map((booking) => cloneBooking(booking));
  }

  async listByRoom(roomId: string): Promise<NAMIBooking[]> {
    return this.bookings
      .filter((booking) => booking.roomId === roomId && booking.status !== "cancelled")
      .map((booking) => cloneBooking(booking));
  }

  async listByRoomAndDate(roomId: string, date: string): Promise<NAMIBooking[]> {
    return this.bookings
      .filter((booking) => booking.roomId === roomId && booking.date === date && booking.status === "confirmed")
      .map((booking) => cloneBooking(booking));
  }

  async listByDateRange(startDate: string, endDate: string): Promise<NAMIBooking[]> {
    return this.bookings
      .filter((booking) => booking.date >= startDate && booking.date <= endDate && booking.status === "confirmed")
      .map((booking) => cloneBooking(booking));
  }

  async findById(id: string): Promise<NAMIBooking | undefined> {
    const booking = this.bookings.find((candidate) => candidate.id === id);
    return booking ? cloneBooking(booking) : undefined;
  }

  async checkConflict(
    roomId: string,
    date: string,
    timeSlots: string[],
    excludeBookingId?: string
  ): Promise<boolean> {
    return this.bookings.some(
      (booking) =>
        booking.roomId === roomId &&
        booking.date === date &&
        booking.status === "confirmed" &&
        booking.id !== excludeBookingId &&
        booking.timeSlots.some((slot) => timeSlots.includes(slot))
    );
  }

  async create(booking: NAMIBooking): Promise<NAMIBooking> {
    const bookingWithId = booking.id ? booking : { ...booking, id: crypto.randomUUID() };
    this.bookings.push(cloneBooking(bookingWithId));
    return cloneBooking(bookingWithId);
  }

  async update(booking: NAMIBooking): Promise<NAMIBooking> {
    const index = this.bookings.findIndex((candidate) => candidate.id === booking.id);
    if (index === -1) {
      throw new Error(`Booking with id ${booking.id} not found`);
    }

    this.bookings[index] = cloneBooking(booking);
    return cloneBooking(this.bookings[index]);
  }

  async delete(id: string): Promise<void> {
    this.bookings = this.bookings.filter((booking) => booking.id !== id);
  }

  async cancel(id: string): Promise<void> {
    const index = this.bookings.findIndex((booking) => booking.id === id);
    if (index !== -1) {
      this.bookings[index].status = "cancelled";
    }
  }
}
