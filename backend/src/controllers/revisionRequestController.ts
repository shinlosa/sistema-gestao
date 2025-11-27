import { Request, Response, NextFunction } from "express";
import { revisionRequests } from "../data/revisionData.js";
import { RevisionRequest } from "../types/nami.js";
import { bookingRepository } from "../repositories/index.js";
import { activityLogService } from "../services/activityLogService.js";
import { ApiError } from "../utils/apiError.js";

const list = (_req: Request, res: Response) => {
  res.json({ revisionRequests });
};

type CreateRevisionRequestBody = {
  roomId: string;
  roomNumber: number;
  roomName: string;
  date: string;
  timeSlots: string[];
  responsible: string;
  serviceType: string;
  justification: string;
};

const create = (req: Request<unknown, unknown, CreateRevisionRequestBody>, res: Response, next: NextFunction) => {
  if (!req.user) return next(ApiError.unauthorized());

  const { roomId, roomNumber, roomName, date, timeSlots, responsible, serviceType, justification } = req.body ?? ({} as CreateRevisionRequestBody);

  if (!roomId || !roomNumber || !roomName || !date || !Array.isArray(timeSlots) || timeSlots.length === 0 || !responsible || !serviceType || !justification) {
    return next(ApiError.badRequest("Dados incompletos para solicitação de revisão"));
  }

  const request: RevisionRequest = {
    id: Date.now().toString(),
    roomId,
    roomNumber,
    roomName,
    date,
    timeSlots,
    responsible,
    serviceType,
    justification,
    requestedByUserId: req.user.id,
    requestedByName: req.user.name,
    status: "open",
    createdAt: new Date().toISOString(),
  };

  revisionRequests.unshift(request);
  res.status(201).json({ request });
};

const approve = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const request = revisionRequests.find((r) => r.id === id);
  if (!request) return next(ApiError.notFound("Solicitação não encontrada"));
  request.status = "approved";

  // Atualiza a reserva correspondente: procura uma reserva existente no mesmo dia e sala que conflita
  // Estratégia simples: se existir uma reserva da sala no mesmo date (ISO yyyy-mm-dd) com conflito de slots, atualiza para os slots da revisão.
  const isoDay = new Date(request.date).toISOString().split("T")[0];
  const byRoomAndDate = bookingRepository.listByRoomAndDate(request.roomId, isoDay);
  const conflict = byRoomAndDate.find((b) => b.status !== "cancelled" && b.timeSlots.some((s) => request.timeSlots.includes(s)));

  if (conflict) {
    const updated = {
      ...conflict,
      date: isoDay,
      timeSlots: [...request.timeSlots],
      responsible: request.responsible,
      serviceType: request.serviceType,
      notes: conflict.notes,
      status: "confirmed" as const,
    };
    bookingRepository.update(updated);
  } else {
    // Não havia reserva (ou já foi cancelada); cria nova confirmada
    bookingRepository.create({
      id: "",
      roomId: request.roomId,
      roomNumber: request.roomNumber,
      roomName: request.roomName,
      date: isoDay,
      timeSlots: [...request.timeSlots],
      responsible: request.responsible,
      serviceType: request.serviceType,
      notes: undefined,
      createdBy: request.requestedByName,
      createdAt: new Date().toISOString(),
      status: "confirmed",
    });
  }

  if (req.user) {
    activityLogService.registerRevisionApproval(req.user.id, request);
  }

  res.json({ request });
};

const reject = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const request = revisionRequests.find((r) => r.id === id);
  if (!request) return next(ApiError.notFound("Solicitação não encontrada"));
  request.status = "rejected";
  if (req.user) {
    activityLogService.registerRevisionRejection(req.user.id, request);
  }
  res.json({ request });
};

export const revisionRequestController = { list, create, approve, reject };
