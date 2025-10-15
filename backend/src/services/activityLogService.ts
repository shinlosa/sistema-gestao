import crypto from "node:crypto";
import { userRepository } from "../repositories/index.js";
import { ActivityLog, NAMIBooking } from "../types/nami.js";

export type LogAction =
  | "Criar Reserva"
  | "Editar Reserva"
  | "Cancelar Reserva"
  | "Login"
  | "Logout"
  | "Gerenciar Usuário"
  | "Sistema";

const inMemoryLogs: ActivityLog[] = [];

const cloneLog = (log: ActivityLog): ActivityLog => ({ ...log });

export const activityLogService = {
  list(): ActivityLog[] {
    return inMemoryLogs.map((log) => cloneLog(log));
  },

  register(action: LogAction, details: string, actorId: string, affectedResource?: string): ActivityLog {
    const user = userRepository.findById(actorId);
    const now = new Date().toISOString();

    const log: ActivityLog = {
      id: crypto.randomUUID(),
      userId: actorId,
      userName: user?.name ?? "Usuário Desconhecido",
      action,
      details,
      timestamp: now,
      affectedResource,
    };

    inMemoryLogs.unshift(log);
    return cloneLog(log);
  },

  registerBookingCreate(actorId: string, booking: NAMIBooking) {
    const resource = `Sala ${booking.roomNumber}`;
    const details = `Reserva criada para ${booking.roomName} - ${booking.serviceType}`;
    this.register("Criar Reserva", details, actorId, resource);
  },

  registerBookingUpdate(actorId: string, booking: NAMIBooking) {
    const resource = `Sala ${booking.roomNumber}`;
    const details = `Reserva editada para ${booking.roomName} - ${booking.serviceType}`;
    this.register("Editar Reserva", details, actorId, resource);
  },

  registerBookingCancellation(actorId: string, booking: NAMIBooking) {
    const resource = `Sala ${booking.roomNumber}`;
    const details = `Reserva cancelada para ${booking.roomName} - ${booking.serviceType}`;
    this.register("Cancelar Reserva", details, actorId, resource);
  },
};
