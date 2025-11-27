import { NAMIRoom } from "../types/nami.js";

export interface RoomRepository {
  list(): NAMIRoom[];
  findById(id: string): NAMIRoom | undefined;
}
