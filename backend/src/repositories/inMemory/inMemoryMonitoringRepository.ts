import { monitorings as seedMonitorings } from "../../data/namiData.js";
import { Monitoring, NAMIRoom } from "../../types/nami.js";
import { MonitoringRepository } from "../monitoringRepository.js";

const cloneRoom = (room: NAMIRoom): NAMIRoom => ({ ...room });

const cloneMonitoring = (monitoring: Monitoring): Monitoring => ({
  ...monitoring,
  rooms: monitoring.rooms.map((room) => cloneRoom(room)),
});

export class InMemoryMonitoringRepository implements MonitoringRepository {
  private monitorings: Monitoring[] = seedMonitorings.map((monitoring) => cloneMonitoring(monitoring));

  list(): Monitoring[] {
    return this.monitorings.map((monitoring) => cloneMonitoring(monitoring));
  }

  findById(id: string): Monitoring | undefined {
    const monitoring = this.monitorings.find((candidate) => candidate.id === id);
    return monitoring ? cloneMonitoring(monitoring) : undefined;
  }
}
