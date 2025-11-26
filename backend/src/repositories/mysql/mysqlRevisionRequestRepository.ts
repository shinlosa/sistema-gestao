import { RevisionRequest, RevisionRequestStatus } from "../../types/nami.js";
import { query, execute, RowDataPacket } from "../../config/database.js";

interface RevisionRequestRow extends RowDataPacket {
  id: string;
  room_id: string;
  room_number: number;
  room_name: string;
  date: Date;
  time_slots: string; // JSON string
  responsible: string;
  service_type: string;
  justification: string;
  requested_by_user_id: string;
  requested_by_name: string;
  status: RevisionRequestStatus;
  created_at: Date;
  reviewed_at: Date | null;
  reviewed_by: string | null;
}

const mapRowToRevisionRequest = (row: RevisionRequestRow): RevisionRequest => ({
  id: row.id,
  roomId: row.room_id,
  roomNumber: row.room_number,
  roomName: row.room_name,
  date: row.date.toISOString().split("T")[0],
  timeSlots: JSON.parse(row.time_slots) as string[],
  responsible: row.responsible,
  serviceType: row.service_type,
  justification: row.justification,
  requestedByUserId: row.requested_by_user_id,
  requestedByName: row.requested_by_name,
  status: row.status,
  createdAt: row.created_at.toISOString(),
});

export interface RevisionRequestRepository {
  list(): Promise<RevisionRequest[]>;
  listByStatus(status: RevisionRequestStatus): Promise<RevisionRequest[]>;
  listByUser(userId: string): Promise<RevisionRequest[]>;
  listPending(): Promise<RevisionRequest[]>;
  findById(id: string): Promise<RevisionRequest | undefined>;
  create(request: RevisionRequest): Promise<RevisionRequest>;
  updateStatus(id: string, status: RevisionRequestStatus, reviewedBy: string): Promise<void>;
  delete(id: string): Promise<void>;
}

export class MySQLRevisionRequestRepository implements RevisionRequestRepository {
  async list(): Promise<RevisionRequest[]> {
    const rows = await query<RevisionRequestRow[]>(
      "SELECT * FROM solicitacoes_revisao ORDER BY created_at DESC"
    );
    return rows.map(mapRowToRevisionRequest);
  }

  async listByStatus(status: RevisionRequestStatus): Promise<RevisionRequest[]> {
    const rows = await query<RevisionRequestRow[]>(
      "SELECT * FROM solicitacoes_revisao WHERE status = ? ORDER BY created_at DESC",
      [status]
    );
    return rows.map(mapRowToRevisionRequest);
  }

  async listByUser(userId: string): Promise<RevisionRequest[]> {
    const rows = await query<RevisionRequestRow[]>(
      "SELECT * FROM solicitacoes_revisao WHERE requested_by_user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    return rows.map(mapRowToRevisionRequest);
  }

  async listPending(): Promise<RevisionRequest[]> {
    const rows = await query<RevisionRequestRow[]>(
      "SELECT * FROM solicitacoes_revisao WHERE status = 'open' ORDER BY created_at ASC"
    );
    return rows.map(mapRowToRevisionRequest);
  }

  async findById(id: string): Promise<RevisionRequest | undefined> {
    const rows = await query<RevisionRequestRow[]>(
      "SELECT * FROM solicitacoes_revisao WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? mapRowToRevisionRequest(rows[0]) : undefined;
  }

  async create(request: RevisionRequest): Promise<RevisionRequest> {
    await execute(
      `INSERT INTO solicitacoes_revisao 
        (id, room_id, room_number, room_name, date, time_slots, responsible, service_type, justification, requested_by_user_id, requested_by_name, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        request.id,
        request.roomId,
        request.roomNumber,
        request.roomName,
        request.date,
        JSON.stringify(request.timeSlots),
        request.responsible,
        request.serviceType,
        request.justification,
        request.requestedByUserId,
        request.requestedByName,
        request.status,
        new Date(request.createdAt),
      ]
    );
    return request;
  }

  async updateStatus(
    id: string,
    status: RevisionRequestStatus,
    reviewedBy: string
  ): Promise<void> {
    await execute(
      "UPDATE solicitacoes_revisao SET status = ?, reviewed_at = NOW(), reviewed_by = ? WHERE id = ?",
      [status, reviewedBy, id]
    );
  }

  async delete(id: string): Promise<void> {
    await execute("DELETE FROM solicitacoes_revisao WHERE id = ?", [id]);
  }
}
