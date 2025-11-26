import * as mysql from "mysql2/promise";
import type { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { environment } from "./environment.js";

let pool: Pool | null = null;

export const getPool = (): Pool => {
  if (!pool) {
    pool = mysql.createPool({
      host: environment.db.host,
      port: environment.db.port,
      user: environment.db.user,
      password: environment.db.password,
      database: environment.db.database,
      waitForConnections: true,
      connectionLimit: environment.db.connectionLimit,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return pool;
};

export const getConnection = async (): Promise<PoolConnection> => {
  const p = getPool();
  return await p.getConnection();
};

export const query = async <T extends RowDataPacket[]>(
  sql: string,
  params?: unknown[]
): Promise<T> => {
  const [rows] = await getPool().query<T>(sql, params);
  return rows;
};

export const execute = async (
  sql: string,
  params?: unknown[]
): Promise<ResultSetHeader> => {
  const [result] = await getPool().execute<ResultSetHeader>(sql, params);
  return result;
};

export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await getConnection();
    await connection.ping();
    connection.release();
    console.log("✅ Conexão com MySQL estabelecida com sucesso");
    return true;
  } catch (error) {
    console.error("❌ Erro ao conectar com MySQL:", error);
    return false;
  }
};

export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log("🔌 Pool de conexões MySQL encerrado");
  }
};

export { RowDataPacket, ResultSetHeader };
