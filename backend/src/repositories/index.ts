import { InMemoryBookingRepository } from "./inMemory/inMemoryBookingRepository.js";
import { InMemoryMonitoringRepository } from "./inMemory/inMemoryMonitoringRepository.js";
import { InMemoryRoomRepository } from "./inMemory/inMemoryRoomRepository.js";
import { InMemoryTimeSlotRepository } from "./inMemory/inMemoryTimeSlotRepository.js";
import { InMemoryUserRepository } from "./inMemory/inMemoryUserRepository.js";

const userRepository = new InMemoryUserRepository();
const bookingRepository = new InMemoryBookingRepository();
const roomRepository = new InMemoryRoomRepository();
const monitoringRepository = new InMemoryMonitoringRepository();
const timeSlotRepository = new InMemoryTimeSlotRepository();

export { bookingRepository, monitoringRepository, roomRepository, timeSlotRepository, userRepository };
