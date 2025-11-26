import { NAMIBooking } from "../../types/nami.js";
import { BookingRepository } from "../bookingRepository.js";
import { query, execute, RowDataPacket } from "../../config/database.js";

interface BookingRow extends RowDataPacket {
  id: string;
  room_id: string;
  room_number: number;
  room_name: string;
  date: Date;
  time_slots: string; // JSON string
  responsible: string;
  service_type: string;
  notes: string | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  status: "confirmed" | "pending" | "cancelled";
}

const mapRowToBooking = (row: BookingRow): NAMIBooking => ({
  id: row.id,
  roomId: row.room_id,
  roomNumber: row.room_number,
  roomName: row.room_name,
  date: row.date.toISOString().split("T")[0],
  timeSlots: JSON.parse(row.time_slots) as string[],
  responsible: row.responsible,
  serviceType: row.service_type,
  notes: row.notes ?? undefined,
  createdBy: row.created_by,
  createdAt: row.created_at.toISOString(),
  status: row.status,
});

export class MySQLBookingRepository implements BookingRepository {
  async list(): Promise<NAMIBooking[]> {
    const rows = await query<BookingRow[]>(
      "SELECT * FROM reservas WHERE status != 'cancelled' ORDER BY date DESC, created_at DESC"
    );
    return rows.map(mapRowToBooking);
  }

  async listByRoom(roomId: string): Promise<NAMIBooking[]> {
    const rows = await query<BookingRow[]>(
      "SELECT * FROM reservas WHERE room_id = ? AND status != 'cancelled' ORDER BY date DESC",
      [roomId]
    );
    return rows.map(mapRowToBooking);
  }

  async listByRoomAndDate(roomId: string, date: string): Promise<NAMIBooking[]> {
    const rows = await query<BookingRow[]>(
      "SELECT * FROM reservas WHERE room_id = ? AND date = ? AND status = 'confirmed'",
      [roomId, date]
    );
    return rows.map(mapRowToBooking);
  }

  async listByDateRange(startDate: string, endDate: string): Promise<NAMIBooking[]> {
    const rows = await query<BookingRow[]>(
      "SELECT * FROM reservas WHERE date BETWEEN ? AND ? AND status = 'confirmed' ORDER BY date, room_number",
      [startDate, endDate]
    );
    return rows.map(mapRowToBooking);
  }

  async findById(id: string): Promise<NAMIBooking | undefined> {
    const rows = await query<BookingRow[]>(
      "SELECT * FROM reservas WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? mapRowToBooking(rows[0]) : undefined;
  }

  async checkConflict(
    roomId: string,
    date: string,
    timeSlots: string[],
    excludeBookingId?: string
  ): Promise<boolean> {
    const timeSlotsJson = JSON.stringify(timeSlots);
    const sql = excludeBookingId
      ? `SELECT COUNT(*) as count FROM reservas 
         WHERE room_id = ? AND date = ? AND status = 'confirmed' 
         AND id != ? AND JSON_OVERLAPS(time_slots, ?)`
      : `SELECT COUNT(*) as count FROM reservas 
         WHERE room_id = ? AND date = ? AND status = 'confirmed' 
         AND JSON_OVERLAPS(time_slots, ?)`;

    const params = excludeBookingId
      ? [roomId, date, excludeBookingId, timeSlotsJson]
      : [roomId, date, timeSlotsJson];

    interface CountRow extends RowDataPacket {
      count: number;
    }
    const rows = await query<CountRow[]>(sql, params);
    return rows[0].count > 0;
  }

  async create(booking: NAMIBooking): Promise<NAMIBooking> {
    await execute(
      `INSERT INTO reservas (id, room_id, room_number, room_name, date, time_slots, responsible, service_type, notes, created_by, created_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        booking.id,
        booking.roomId,
        booking.roomNumber,
        booking.roomName,
        booking.date,
        JSON.stringify(booking.timeSlots),
        booking.responsible,
        booking.serviceType,
        booking.notes ?? null,
        booking.createdBy,
        new Date(booking.createdAt),
        booking.status,
      ]
    );
    return booking;
  }

  async update(booking: NAMIBooking): Promise<NAMIBooking> {
    await execute(
      `UPDATE reservas SET 
        room_id = ?, room_number = ?, room_name = ?, date = ?, time_slots = ?,
        responsible = ?, service_type = ?, notes = ?, status = ?
       WHERE id = ?`,
      [
        booking.roomId,
        booking.roomNumber,
        booking.roomName,
        booking.date,
        JSON.stringify(booking.timeSlots),
        booking.responsible,
        booking.serviceType,
        booking.notes ?? null,
        booking.status,
        booking.id,
      ]
    );
    return booking;
  }

  async delete(id: string): Promise<void> {
    await execute("DELETE FROM reservas WHERE id = ?", [id]);
  }

  async cancel(id: string): Promise<void> {
    await execute(
      "UPDATE reservas SET status = 'cancelled' WHERE id = ?",
      [id]
    );
  }
}
