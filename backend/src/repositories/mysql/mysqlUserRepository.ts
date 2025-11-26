import { User, UserRole, UserStatus } from "../../types/nami.js";
import { UserRepository } from "../userRepository.js";
import { query, execute, RowDataPacket } from "../../config/database.js";

interface UserRow extends RowDataPacket {
  id: string;
  username: string;
  password_hash: string;
  name: string;
  email: string;
  role: UserRole;
  department: string | null;
  status: UserStatus;
  created_at: Date;
  last_login: Date | null;
  requested_by: string | null;
  approved_by: string | null;
  approved_at: Date | null;
}

const mapRowToUser = (row: UserRow): User => ({
  id: row.id,
  username: row.username,
  passwordHash: row.password_hash,
  name: row.name,
  email: row.email,
  role: row.role,
  department: row.department ?? undefined,
  status: row.status,
  createdAt: row.created_at.toISOString(),
  lastLogin: row.last_login?.toISOString(),
  requestedBy: row.requested_by ?? undefined,
  approvedBy: row.approved_by ?? undefined,
  approvedAt: row.approved_at?.toISOString(),
});

export class MySQLUserRepository implements UserRepository {
  async findById(id: string): Promise<User | undefined> {
    const rows = await query<UserRow[]>(
      "SELECT * FROM usuarios WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? mapRowToUser(rows[0]) : undefined;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const rows = await query<UserRow[]>(
      "SELECT * FROM usuarios WHERE username = ?",
      [username]
    );
    return rows.length > 0 ? mapRowToUser(rows[0]) : undefined;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const rows = await query<UserRow[]>(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    return rows.length > 0 ? mapRowToUser(rows[0]) : undefined;
  }

  async list(): Promise<User[]> {
    const rows = await query<UserRow[]>(
      "SELECT * FROM usuarios ORDER BY created_at DESC"
    );
    return rows.map(mapRowToUser);
  }

  async listByStatus(status: UserStatus): Promise<User[]> {
    const rows = await query<UserRow[]>(
      "SELECT * FROM usuarios WHERE status = ? ORDER BY created_at DESC",
      [status]
    );
    return rows.map(mapRowToUser);
  }

  async create(user: User): Promise<User> {
    await execute(
      `INSERT INTO usuarios (id, username, password_hash, name, email, role, department, status, created_at, requested_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        user.username,
        user.passwordHash,
        user.name,
        user.email,
        user.role,
        user.department ?? null,
        user.status,
        new Date(user.createdAt),
        user.requestedBy ?? null,
      ]
    );
    return user;
  }

  async update(user: User): Promise<User> {
    await execute(
      `UPDATE usuarios SET 
        username = ?, password_hash = ?, name = ?, email = ?, role = ?,
        department = ?, status = ?, last_login = ?, approved_by = ?, approved_at = ?
       WHERE id = ?`,
      [
        user.username,
        user.passwordHash,
        user.name,
        user.email,
        user.role,
        user.department ?? null,
        user.status,
        user.lastLogin ? new Date(user.lastLogin) : null,
        user.approvedBy ?? null,
        user.approvedAt ? new Date(user.approvedAt) : null,
        user.id,
      ]
    );
    return user;
  }

  async updateLastLogin(id: string): Promise<void> {
    await execute(
      "UPDATE usuarios SET last_login = NOW() WHERE id = ?",
      [id]
    );
  }

  async delete(id: string): Promise<void> {
    await execute("DELETE FROM usuarios WHERE id = ?", [id]);
  }
}
