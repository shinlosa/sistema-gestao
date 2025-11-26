import { Monitoring } from "../types/nami.js";

export interface MonitoringRepository {
  list(): Promise<Monitoring[]>;
  findById(id: string): Promise<Monitoring | undefined>;
  create(monitoring: Omit<Monitoring, "rooms">): Promise<Monitoring>;
  update(monitoring: Omit<Monitoring, "rooms">): Promise<Monitoring>;
  delete(id: string): Promise<void>;
}
