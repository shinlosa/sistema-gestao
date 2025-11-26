import { TimeSlot } from "../types/nami.js";

export interface TimeSlotRepository {
  list(): Promise<TimeSlot[]>;
  findById(id: string): Promise<TimeSlot | undefined>;
  listByPeriod(period: "morning" | "afternoon"): Promise<TimeSlot[]>;
}
