import { namiRooms } from "../../data/namiData.js";
import { NAMIRoom } from "../../types/nami.js";
import { RoomRepository } from "../roomRepository.js";

const cloneRoom = (room: NAMIRoom): NAMIRoom => ({ ...room });

export class InMemoryRoomRepository implements RoomRepository {
  private rooms: NAMIRoom[] = namiRooms.map((room) => cloneRoom(room));

  list(): NAMIRoom[] {
    return this.rooms.map((room) => cloneRoom(room));
  }

  findById(id: string): NAMIRoom | undefined {
    const room = this.rooms.find((candidate) => candidate.id === id);
    return room ? cloneRoom(room) : undefined;
  }
}
