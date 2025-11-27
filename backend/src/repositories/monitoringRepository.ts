import { Monitoring } from "../types/nami.js";

export interface MonitoringRepository {
  list(): Monitoring[];
  findById(id: string): Monitoring | undefined;
}
