/* eslint-disable @typescript-eslint/require-await */
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

  async list(): Promise<Monitoring[]> {
    return this.monitorings.map((monitoring) => cloneMonitoring(monitoring));
  }

  async findById(id: string): Promise<Monitoring | undefined> {
    const monitoring = this.monitorings.find((candidate) => candidate.id === id);
    return monitoring ? cloneMonitoring(monitoring) : undefined;
  }

  async create(monitoring: Omit<Monitoring, "rooms">): Promise<Monitoring> {
    const newMonitoring: Monitoring = { ...monitoring, rooms: [], responsaveis: [] };
    this.monitorings.push(newMonitoring);
    return cloneMonitoring(newMonitoring);
  }

  async update(monitoring: Omit<Monitoring, "rooms">): Promise<Monitoring> {
    const index = this.monitorings.findIndex((candidate) => candidate.id === monitoring.id);
    if (index === -1) {
      throw new Error(`Monitoring with id ${monitoring.id} not found`);
    }
    const existingRooms = this.monitorings[index].rooms;
    this.monitorings[index] = { ...monitoring, rooms: existingRooms };
    return cloneMonitoring(this.monitorings[index]);
  }

  async delete(id: string): Promise<void> {
    this.monitorings = this.monitorings.filter((monitoring) => monitoring.id !== id);
  }
}
