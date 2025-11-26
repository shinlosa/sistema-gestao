import { NAMIRoom } from "../../types/nami.js";
import { RoomRepository } from "../roomRepository.js";
import { query, execute, RowDataPacket } from "../../config/database.js";

interface RoomRow extends RowDataPacket {
  id: string;
  number: number;
  name: string;
  monitoring_id: string | null;
  capacity: number;
  description: string | null;
  default_responsible: string | null;
  is_independent: boolean;
  available: boolean;
  created_at: Date;
  updated_at: Date;
}

const mapRowToRoom = (row: RoomRow): NAMIRoom => ({
  id: row.id,
  number: row.number,
  name: row.name,
  monitoringId: row.monitoring_id ?? undefined,
  capacity: row.capacity,
  description: row.description ?? "",
  defaultResponsible: row.default_responsible ?? undefined,
  isIndependent: Boolean(row.is_independent),
  available: Boolean(row.available),
});

export class MySQLRoomRepository implements RoomRepository {
  async list(): Promise<NAMIRoom[]> {
    const rows = await query<RoomRow[]>(
      "SELECT * FROM salas ORDER BY number"
    );
    return rows.map(mapRowToRoom);
  }

  async listAvailable(): Promise<NAMIRoom[]> {
    const rows = await query<RoomRow[]>(
      "SELECT * FROM salas WHERE available = TRUE ORDER BY number"
    );
    return rows.map(mapRowToRoom);
  }

  async listByMonitoring(monitoringId: string): Promise<NAMIRoom[]> {
    const rows = await query<RoomRow[]>(
      "SELECT * FROM salas WHERE monitoring_id = ? ORDER BY number",
      [monitoringId]
    );
    return rows.map(mapRowToRoom);
  }

  async listIndependent(): Promise<NAMIRoom[]> {
    const rows = await query<RoomRow[]>(
      "SELECT * FROM salas WHERE is_independent = TRUE ORDER BY number"
    );
    return rows.map(mapRowToRoom);
  }

  async findById(id: string): Promise<NAMIRoom | undefined> {
    const rows = await query<RoomRow[]>(
      "SELECT * FROM salas WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? mapRowToRoom(rows[0]) : undefined;
  }

  async findByNumber(number: number): Promise<NAMIRoom | undefined> {
    const rows = await query<RoomRow[]>(
      "SELECT * FROM salas WHERE number = ?",
      [number]
    );
    return rows.length > 0 ? mapRowToRoom(rows[0]) : undefined;
  }

  async create(room: NAMIRoom): Promise<NAMIRoom> {
    await execute(
      `INSERT INTO salas (id, number, name, monitoring_id, capacity, description, default_responsible, is_independent, available)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        room.id,
        room.number,
        room.name,
        room.monitoringId ?? null,
        room.capacity,
        room.description ?? null,
        room.defaultResponsible ?? null,
        room.isIndependent,
        room.available,
      ]
    );
    return room;
  }

  async update(room: NAMIRoom): Promise<NAMIRoom> {
    await execute(
      `UPDATE salas SET 
        number = ?, name = ?, monitoring_id = ?, capacity = ?,
        description = ?, default_responsible = ?, is_independent = ?, available = ?
       WHERE id = ?`,
      [
        room.number,
        room.name,
        room.monitoringId ?? null,
        room.capacity,
        room.description ?? null,
        room.defaultResponsible ?? null,
        room.isIndependent,
        room.available,
        room.id,
      ]
    );
    return room;
  }

  async delete(id: string): Promise<void> {
    await execute("DELETE FROM salas WHERE id = ?", [id]);
  }

  async setAvailability(id: string, available: boolean): Promise<void> {
    await execute(
      "UPDATE salas SET available = ? WHERE id = ?",
      [available, id]
    );
  }
}
