import { environment } from "../config/environment.js";

// Importar repositórios MySQL
import { MySQLUserRepository } from "./mysql/mysqlUserRepository.js";
import { MySQLBookingRepository } from "./mysql/mysqlBookingRepository.js";
import { MySQLRoomRepository } from "./mysql/mysqlRoomRepository.js";
import { MySQLMonitoringRepository } from "./mysql/mysqlMonitoringRepository.js";
import { MySQLTimeSlotRepository } from "./mysql/mysqlTimeSlotRepository.js";
import { MySQLActivityLogRepository } from "./mysql/mysqlActivityLogRepository.js";
import { MySQLRevisionRequestRepository } from "./mysql/mysqlRevisionRequestRepository.js";

// Importar repositórios InMemory (fallback)
import { InMemoryBookingRepository } from "./inMemory/inMemoryBookingRepository.js";
import { InMemoryMonitoringRepository } from "./inMemory/inMemoryMonitoringRepository.js";
import { InMemoryRoomRepository } from "./inMemory/inMemoryRoomRepository.js";
import { InMemoryTimeSlotRepository } from "./inMemory/inMemoryTimeSlotRepository.js";
import { InMemoryUserRepository } from "./inMemory/inMemoryUserRepository.js";

// Usar MySQL em produção/desenvolvimento com banco configurado, InMemory para testes
const useMySQL = environment.db.host !== "" && environment.nodeEnv !== "test";

// Instanciar repositórios baseado no ambiente
const userRepository = useMySQL ? new MySQLUserRepository() : new InMemoryUserRepository();
const bookingRepository = useMySQL ? new MySQLBookingRepository() : new InMemoryBookingRepository();
const roomRepository = useMySQL ? new MySQLRoomRepository() : new InMemoryRoomRepository();
const monitoringRepository = useMySQL ? new MySQLMonitoringRepository() : new InMemoryMonitoringRepository();
const timeSlotRepository = useMySQL ? new MySQLTimeSlotRepository() : new InMemoryTimeSlotRepository();
const activityLogRepository = useMySQL ? new MySQLActivityLogRepository() : null;
const revisionRequestRepository = useMySQL ? new MySQLRevisionRequestRepository() : null;

export {
  bookingRepository,
  monitoringRepository,
  roomRepository,
  timeSlotRepository,
  userRepository,
  activityLogRepository,
  revisionRequestRepository,
};
