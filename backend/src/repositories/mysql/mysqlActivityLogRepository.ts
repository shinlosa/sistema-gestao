import { ActivityLog } from "../../types/nami.js";
import { query, execute, RowDataPacket } from "../../config/database.js";

interface ActivityLogRow extends RowDataPacket {
  id: string;
  user_id: string | null;
  user_name: string;
  action: string;
  details: string | null;
  timestamp: Date;
  affected_resource: string | null;
  ip_address: string | null;
  user_agent: string | null;
}

const mapRowToActivityLog = (row: ActivityLogRow): ActivityLog => ({
  id: row.id,
  userId: row.user_id ?? "",
  userName: row.user_name,
  action: row.action,
  details: row.details ?? "",
  timestamp: row.timestamp.toISOString(),
  affectedResource: row.affected_resource ?? undefined,
  ipAddress: row.ip_address ?? undefined,
  userAgent: row.user_agent ?? undefined,
});

export interface ActivityLogRepository {
  list(limit?: number): Promise<ActivityLog[]>;
  listByUser(userId: string, limit?: number): Promise<ActivityLog[]>;
  listByAction(action: string, limit?: number): Promise<ActivityLog[]>;
  listByDateRange(startDate: string, endDate: string): Promise<ActivityLog[]>;
  findById(id: string): Promise<ActivityLog | undefined>;
  create(log: ActivityLog): Promise<ActivityLog>;
  deleteOlderThan(days: number): Promise<number>;
}

export class MySQLActivityLogRepository implements ActivityLogRepository {
  async list(limit: number = 100): Promise<ActivityLog[]> {
    const rows = await query<ActivityLogRow[]>(
      "SELECT * FROM logs_atividade ORDER BY timestamp DESC LIMIT ?",
      [limit]
    );
    return rows.map(mapRowToActivityLog);
  }

  async listByUser(userId: string, limit: number = 100): Promise<ActivityLog[]> {
    const rows = await query<ActivityLogRow[]>(
      "SELECT * FROM logs_atividade WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?",
      [userId, limit]
    );
    return rows.map(mapRowToActivityLog);
  }

  async listByAction(action: string, limit: number = 100): Promise<ActivityLog[]> {
    const rows = await query<ActivityLogRow[]>(
      "SELECT * FROM logs_atividade WHERE action = ? ORDER BY timestamp DESC LIMIT ?",
      [action, limit]
    );
    return rows.map(mapRowToActivityLog);
  }

  async listByDateRange(startDate: string, endDate: string): Promise<ActivityLog[]> {
    const rows = await query<ActivityLogRow[]>(
      "SELECT * FROM logs_atividade WHERE DATE(timestamp) BETWEEN ? AND ? ORDER BY timestamp DESC",
      [startDate, endDate]
    );
    return rows.map(mapRowToActivityLog);
  }

  async findById(id: string): Promise<ActivityLog | undefined> {
    const rows = await query<ActivityLogRow[]>(
      "SELECT * FROM logs_atividade WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? mapRowToActivityLog(rows[0]) : undefined;
  }

  async create(log: ActivityLog): Promise<ActivityLog> {
    await execute(
      `INSERT INTO logs_atividade (id, user_id, user_name, action, details, timestamp, affected_resource, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        log.id,
        log.userId || null,
        log.userName,
        log.action,
        log.details || null,
        new Date(log.timestamp),
        log.affectedResource || null,
        log.ipAddress || null,
        log.userAgent || null,
      ]
    );
    return log;
  }

  async deleteOlderThan(days: number): Promise<number> {
    const result = await execute(
      "DELETE FROM logs_atividade WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)",
      [days]
    );
    return result.affectedRows;
  }
}
