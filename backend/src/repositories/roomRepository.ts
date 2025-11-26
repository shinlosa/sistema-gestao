import { NAMIRoom } from "../types/nami.js";

export interface RoomRepository {
  list(): Promise<NAMIRoom[]>;
  listAvailable(): Promise<NAMIRoom[]>;
  listByMonitoring(monitoringId: string): Promise<NAMIRoom[]>;
  listIndependent(): Promise<NAMIRoom[]>;
  findById(id: string): Promise<NAMIRoom | undefined>;
  findByNumber(number: number): Promise<NAMIRoom | undefined>;
  create(room: NAMIRoom): Promise<NAMIRoom>;
  update(room: NAMIRoom): Promise<NAMIRoom>;
  delete(id: string): Promise<void>;
  setAvailability(id: string, available: boolean): Promise<void>;
}
