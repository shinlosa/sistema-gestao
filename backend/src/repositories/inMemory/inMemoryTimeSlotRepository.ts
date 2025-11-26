/* eslint-disable @typescript-eslint/require-await */
import { timeSlots as seedTimeSlots } from "../../data/namiData.js";
import { TimeSlot } from "../../types/nami.js";
import { TimeSlotRepository } from "../timeSlotRepository.js";

const cloneTimeSlot = (timeSlot: TimeSlot): TimeSlot => ({ ...timeSlot });

export class InMemoryTimeSlotRepository implements TimeSlotRepository {
  private timeSlots: TimeSlot[] = seedTimeSlots.map((timeSlot) => cloneTimeSlot(timeSlot));

  async list(): Promise<TimeSlot[]> {
    return this.timeSlots.map((timeSlot) => cloneTimeSlot(timeSlot));
  }

  async findById(id: string): Promise<TimeSlot | undefined> {
    const timeSlot = this.timeSlots.find((candidate) => candidate.id === id);
    return timeSlot ? cloneTimeSlot(timeSlot) : undefined;
  }

  async listByPeriod(period: "morning" | "afternoon"): Promise<TimeSlot[]> {
    return this.timeSlots.filter((slot) => slot.period === period).map((timeSlot) => cloneTimeSlot(timeSlot));
  }
}
