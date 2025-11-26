/* eslint-disable @typescript-eslint/require-await */
import { namiRooms } from "../../data/namiData.js";
import { NAMIRoom } from "../../types/nami.js";
import { RoomRepository } from "../roomRepository.js";

const cloneRoom = (room: NAMIRoom): NAMIRoom => ({ ...room });

export class InMemoryRoomRepository implements RoomRepository {
  private rooms: NAMIRoom[] = namiRooms.map((room) => cloneRoom(room));

  async list(): Promise<NAMIRoom[]> {
    return this.rooms.map((room) => cloneRoom(room));
  }

  async listAvailable(): Promise<NAMIRoom[]> {
    return this.rooms.filter((room) => room.available).map((room) => cloneRoom(room));
  }

  async listByMonitoring(monitoringId: string): Promise<NAMIRoom[]> {
    return this.rooms.filter((room) => room.monitoringId === monitoringId).map((room) => cloneRoom(room));
  }

  async listIndependent(): Promise<NAMIRoom[]> {
    return this.rooms.filter((room) => room.isIndependent).map((room) => cloneRoom(room));
  }

  async findById(id: string): Promise<NAMIRoom | undefined> {
    const room = this.rooms.find((candidate) => candidate.id === id);
    return room ? cloneRoom(room) : undefined;
  }

  async findByNumber(number: number): Promise<NAMIRoom | undefined> {
    const room = this.rooms.find((candidate) => candidate.number === number);
    return room ? cloneRoom(room) : undefined;
  }

  async create(room: NAMIRoom): Promise<NAMIRoom> {
    this.rooms.push(cloneRoom(room));
    return cloneRoom(room);
  }

  async update(room: NAMIRoom): Promise<NAMIRoom> {
    const index = this.rooms.findIndex((candidate) => candidate.id === room.id);
    if (index === -1) {
      throw new Error(`Room with id ${room.id} not found`);
    }
    this.rooms[index] = cloneRoom(room);
    return cloneRoom(this.rooms[index]);
  }

  async delete(id: string): Promise<void> {
    this.rooms = this.rooms.filter((room) => room.id !== id);
  }

  async setAvailability(id: string, available: boolean): Promise<void> {
    const index = this.rooms.findIndex((room) => room.id === id);
    if (index !== -1) {
      this.rooms[index].available = available;
    }
  }
}
