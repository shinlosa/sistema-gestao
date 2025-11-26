import { Monitoring, NAMIRoom } from "../../types/nami.js";
import { MonitoringRepository } from "../monitoringRepository.js";
import { query, execute, RowDataPacket } from "../../config/database.js";

interface MonitoringRow extends RowDataPacket {
  id: string;
  name: string;
  service_type: string | null;
  allowed_periods: string; // JSON string
  reservavel: boolean;
  created_at: Date;
  updated_at: Date;
}

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

export class MySQLMonitoringRepository implements MonitoringRepository {
  async list(): Promise<Monitoring[]> {
    const monitoringRows = await query<MonitoringRow[]>(
      "SELECT * FROM monitoramentos ORDER BY name"
    );

    const monitorings: Monitoring[] = [];

    for (const row of monitoringRows) {
      const roomRows = await query<RoomRow[]>(
        "SELECT * FROM salas WHERE monitoring_id = ? AND is_independent = FALSE ORDER BY number",
        [row.id]
      );

      monitorings.push({
        id: row.id,
        name: row.name,
        serviceType: row.service_type ?? undefined,
        allowedPeriods: JSON.parse(row.allowed_periods) as string[],
        reservavel: Boolean(row.reservavel),
        rooms: roomRows.map(mapRowToRoom),
        responsaveis: [],
      });
    }

    return monitorings;
  }

  async findById(id: string): Promise<Monitoring | undefined> {
    const rows = await query<MonitoringRow[]>(
      "SELECT * FROM monitoramentos WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return undefined;
    }

    const row = rows[0];
    const roomRows = await query<RoomRow[]>(
      "SELECT * FROM salas WHERE monitoring_id = ? AND is_independent = FALSE ORDER BY number",
      [id]
    );

    return {
      id: row.id,
      name: row.name,
      serviceType: row.service_type ?? undefined,
      allowedPeriods: JSON.parse(row.allowed_periods) as string[],
      reservavel: Boolean(row.reservavel),
      rooms: roomRows.map(mapRowToRoom),
      responsaveis: [],
    };
  }

  async create(monitoring: Omit<Monitoring, "rooms">): Promise<Monitoring> {
    await execute(
      `INSERT INTO monitoramentos (id, name, service_type, allowed_periods, reservavel)
       VALUES (?, ?, ?, ?, ?)`,
      [
        monitoring.id,
        monitoring.name,
        monitoring.serviceType ?? null,
        JSON.stringify(monitoring.allowedPeriods),
        monitoring.reservavel ?? true,
      ]
    );

    return {
      ...monitoring,
      rooms: [],
      responsaveis: [],
    };
  }

  async update(monitoring: Omit<Monitoring, "rooms">): Promise<Monitoring> {
    await execute(
      `UPDATE monitoramentos SET 
        name = ?, service_type = ?, allowed_periods = ?, reservavel = ?
       WHERE id = ?`,
      [
        monitoring.name,
        monitoring.serviceType ?? null,
        JSON.stringify(monitoring.allowedPeriods),
        monitoring.reservavel ?? true,
        monitoring.id,
      ]
    );

    const roomRows = await query<RoomRow[]>(
      "SELECT * FROM salas WHERE monitoring_id = ? AND is_independent = FALSE ORDER BY number",
      [monitoring.id]
    );

    return {
      ...monitoring,
      rooms: roomRows.map(mapRowToRoom),
      responsaveis: [],
    };
  }

  async delete(id: string): Promise<void> {
    await execute("DELETE FROM monitoramentos WHERE id = ?", [id]);
  }
}
