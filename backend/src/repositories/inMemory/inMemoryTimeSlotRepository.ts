import { timeSlots as seedTimeSlots } from "../../data/namiData.js";
import { TimeSlot } from "../../types/nami.js";
import { TimeSlotRepository } from "../timeSlotRepository.js";

const cloneTimeSlot = (timeSlot: TimeSlot): TimeSlot => ({ ...timeSlot });

export class InMemoryTimeSlotRepository implements TimeSlotRepository {
  private timeSlots: TimeSlot[] = seedTimeSlots.map((timeSlot) => cloneTimeSlot(timeSlot));

  list(): TimeSlot[] {
    return this.timeSlots.map((timeSlot) => cloneTimeSlot(timeSlot));
  }

  findById(id: string): TimeSlot | undefined {
    const timeSlot = this.timeSlots.find((candidate) => candidate.id === id);
    return timeSlot ? cloneTimeSlot(timeSlot) : undefined;
  }
}
