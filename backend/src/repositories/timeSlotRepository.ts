import { TimeSlot } from "../types/nami.js";

export interface TimeSlotRepository {
  list(): TimeSlot[];
  findById(id: string): TimeSlot | undefined;
}
