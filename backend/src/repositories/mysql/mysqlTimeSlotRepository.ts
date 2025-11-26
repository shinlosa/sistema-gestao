import { TimeSlot } from "../../types/nami.js";
import { TimeSlotRepository } from "../timeSlotRepository.js";
import { query, RowDataPacket } from "../../config/database.js";

interface TimeSlotRow extends RowDataPacket {
  id: string;
  label: string;
  start_time: string;
  end_time: string;
  period: "morning" | "afternoon";
  display_order: number;
}

const formatTime = (timeStr: string): string => {
  // MySQL retorna time como "HH:MM:SS", precisamos converter para "HH:MM"
  if (timeStr.includes(":")) {
    const parts = timeStr.split(":");
    return `${parts[0]}:${parts[1]}`;
  }
  return timeStr;
};

const mapRowToTimeSlot = (row: TimeSlotRow): TimeSlot => ({
  id: row.id,
  label: row.label,
  start: formatTime(row.start_time),
  end: formatTime(row.end_time),
  period: row.period,
});

export class MySQLTimeSlotRepository implements TimeSlotRepository {
  async list(): Promise<TimeSlot[]> {
    const rows = await query<TimeSlotRow[]>(
      "SELECT * FROM blocos_horarios ORDER BY display_order"
    );
    return rows.map(mapRowToTimeSlot);
  }

  async findById(id: string): Promise<TimeSlot | undefined> {
    const rows = await query<TimeSlotRow[]>(
      "SELECT * FROM blocos_horarios WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? mapRowToTimeSlot(rows[0]) : undefined;
  }

  async listByPeriod(period: "morning" | "afternoon"): Promise<TimeSlot[]> {
    const rows = await query<TimeSlotRow[]>(
      "SELECT * FROM blocos_horarios WHERE period = ? ORDER BY display_order",
      [period]
    );
    return rows.map(mapRowToTimeSlot);
  }
}
