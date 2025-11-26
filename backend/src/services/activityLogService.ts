import crypto from "node:crypto";
import { userRepository } from "../repositories/index.js";
import { ActivityLog, NAMIBooking, RevisionRequest } from "../types/nami.js";

export type LogAction =
  | "Criar Reserva"
  | "Editar Reserva"
  | "Cancelar Reserva"
  | "Login"
  | "Logout"
  | "Gerenciar Usuário"
  | "Sistema"
  | "Aprovar Revisão"
  | "Rejeitar Revisão";

const inMemoryLogs: ActivityLog[] = [];

const cloneLog = (log: ActivityLog): ActivityLog => ({ ...log });

export const activityLogService = {
  list(): ActivityLog[] {
    return inMemoryLogs.map((log) => cloneLog(log));
  },

  async register(
    action: LogAction,
    details: string,
    actorId: string,
    affectedResource?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ActivityLog> {
    const user = await userRepository.findById(actorId);
    const now = new Date().toISOString();

    const log: ActivityLog = {
      id: crypto.randomUUID(),
      userId: actorId,
      userName: user?.name ?? "Usuário Desconhecido",
      action,
      details,
      timestamp: now,
      affectedResource,
      ipAddress,
      userAgent,
    };

    inMemoryLogs.unshift(log);
    return cloneLog(log);
  },

  async registerBookingCreate(actorId: string, booking: NAMIBooking) {
    const resource = `Sala ${booking.roomNumber}`;
    const details = `Reserva criada para ${booking.roomName} - ${booking.serviceType}`;
    await this.register("Criar Reserva", details, actorId, resource);
  },

  async registerBookingUpdate(actorId: string, booking: NAMIBooking) {
    const resource = `Sala ${booking.roomNumber}`;
    const details = `Reserva editada para ${booking.roomName} - ${booking.serviceType}`;
    await this.register("Editar Reserva", details, actorId, resource);
  },

  async registerBookingCancellation(actorId: string, booking: NAMIBooking) {
    const resource = `Sala ${booking.roomNumber}`;
    const details = `Reserva cancelada para ${booking.roomName} - ${booking.serviceType}`;
    await this.register("Cancelar Reserva", details, actorId, resource);
  },

  async registerRevisionApproval(actorId: string, request: RevisionRequest) {
    const resource = `Sala ${request.roomNumber}`;
    const details = `Revisão aprovada para ${request.roomName} - ${request.serviceType} • ${new Date(
      request.date,
    ).toLocaleDateString("pt-BR")} • ${request.timeSlots.join(", ")}`;
    await this.register("Aprovar Revisão", details, actorId, resource);
  },

  async registerRevisionRejection(actorId: string, request: RevisionRequest) {
    const resource = `Sala ${request.roomNumber}`;
    const details = `Revisão rejeitada para ${request.roomName} - ${request.serviceType}`;
    await this.register("Rejeitar Revisão", details, actorId, resource);
  },
};
