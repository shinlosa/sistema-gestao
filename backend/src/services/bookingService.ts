import { bookingRepository, monitoringRepository, roomRepository, timeSlotRepository } from "../repositories/index.js";
import { NAMIBooking } from "../types/nami.js";
import { ApiError } from "../utils/apiError.js";
import { activityLogService } from "./activityLogService.js";

export type BookingInput = {
  roomId: string;
  date: string;
  timeSlots: string[];
  responsible: string;
  serviceType: string;
  notes?: string;
  status?: NAMIBooking["status"];
};

export type Actor = {
  id: string;
  name: string;
};

const normalizeDate = (rawDate: string): string => {
  const parsedDate = new Date(rawDate);
  if (Number.isNaN(parsedDate.getTime())) {
    throw ApiError.badRequest("Data inválida");
  }

  return parsedDate.toISOString().split("T")[0];
};

const ensureUniqueTimeSlots = (timeSlots: string[]): string[] => {
  if (timeSlots.length === 0) {
    throw ApiError.badRequest("Selecione ao menos um horário");
  }

  const unique = Array.from(new Set(timeSlots));
  if (unique.length !== timeSlots.length) {
    throw ApiError.badRequest("Selecione horários sem duplicidades");
  }
  return unique;
};

const ensureTimeSlotsExist = (timeSlots: string[]) => {
  const availableSlots = timeSlotRepository.list();
  const availableIds = new Set(availableSlots.map((slot) => slot.id));

  const invalid = timeSlots.filter((slot) => !availableIds.has(slot));
  if (invalid.length > 0) {
    throw ApiError.badRequest("Horários inválidos selecionados", { invalidTimeSlots: invalid });
  }
};

const ensureTimeSlotsAllowedForRoom = (roomId: string, timeSlots: string[]) => {
  const room = roomRepository.findById(roomId);
  if (!room) {
    throw ApiError.notFound("Sala não encontrada");
  }

  if (!room.monitoringId) {
    return;
  }

  const monitoring = monitoringRepository.findById(room.monitoringId);
  if (!monitoring) {
    return;
  }

  const allowed = new Set(monitoring.allowedPeriods);
  const disallowed = timeSlots.filter((slot) => !allowed.has(slot));

  if (disallowed.length > 0) {
    throw ApiError.badRequest("Horários não permitidos para esta sala", { disallowedTimeSlots: disallowed });
  }
};

const ensureNoBookingConflicts = (params: {
  roomId: string;
  date: string;
  timeSlots: string[];
  ignoreBookingId?: string;
}) => {
  const { roomId, date, timeSlots, ignoreBookingId } = params;
  const bookings = bookingRepository.listByRoomAndDate(roomId, date);
  const requested = new Set(timeSlots);

  const conflict = bookings.find((booking) => {
    if (booking.status === "cancelled") {
      return false;
    }

    if (ignoreBookingId && booking.id === ignoreBookingId) {
      return false;
    }

    return booking.timeSlots.some((slot) => requested.has(slot));
  });

  if (conflict) {
    throw ApiError.conflict("Já existe reserva para um ou mais horários selecionados", {
      conflictingBookingId: conflict.id,
    });
  }
};

const buildBookingRecord = (input: BookingInput & { date: string }, actor: Actor, source?: NAMIBooking): NAMIBooking => {
  const room = roomRepository.findById(input.roomId);
  if (!room) {
    throw ApiError.notFound("Sala não encontrada");
  }

  const base: NAMIBooking = {
    id: source?.id ?? "",
    roomId: room.id,
    roomNumber: room.number,
    roomName: room.name,
    date: input.date,
    timeSlots: [...input.timeSlots],
    responsible: input.responsible,
    serviceType: input.serviceType,
    notes: input.notes?.trim() ? input.notes.trim() : undefined,
    createdBy: source?.createdBy ?? actor.name,
    createdAt: source?.createdAt ?? new Date().toISOString(),
    status: input.status ?? source?.status ?? "confirmed",
  };

  return base;
};

export const bookingService = {
  createBooking(rawInput: BookingInput, actor: Actor): NAMIBooking {
    if (!actor?.id) {
      throw ApiError.unauthorized();
    }

    const uniqueTimeSlots = ensureUniqueTimeSlots(rawInput.timeSlots);
    ensureTimeSlotsExist(uniqueTimeSlots);
    ensureTimeSlotsAllowedForRoom(rawInput.roomId, uniqueTimeSlots);

    const normalizedDate = normalizeDate(rawInput.date);
    ensureNoBookingConflicts({ roomId: rawInput.roomId, date: normalizedDate, timeSlots: uniqueTimeSlots });

    const bookingRecord = buildBookingRecord(
      { ...rawInput, timeSlots: uniqueTimeSlots, date: normalizedDate },
      actor,
    );

    const saved = bookingRepository.create(bookingRecord);
    activityLogService.registerBookingCreate(actor.id, saved);
    return saved;
  },

  updateBooking(bookingId: string, rawInput: BookingInput, actor: Actor): NAMIBooking {
    if (!actor?.id) {
      throw ApiError.unauthorized();
    }

    const existing = bookingRepository.findById(bookingId);
    if (!existing) {
      throw ApiError.notFound("Reserva não encontrada");
    }

    const uniqueTimeSlots = ensureUniqueTimeSlots(rawInput.timeSlots);
    ensureTimeSlotsExist(uniqueTimeSlots);
    ensureTimeSlotsAllowedForRoom(rawInput.roomId, uniqueTimeSlots);

    const normalizedDate = normalizeDate(rawInput.date);
    ensureNoBookingConflicts({
      roomId: rawInput.roomId,
      date: normalizedDate,
      timeSlots: uniqueTimeSlots,
      ignoreBookingId: bookingId,
    });

    const updatedRecord = buildBookingRecord(
      { ...rawInput, timeSlots: uniqueTimeSlots, date: normalizedDate },
      actor,
      existing,
    );
    updatedRecord.id = bookingId;
    updatedRecord.createdBy = existing.createdBy;
    updatedRecord.createdAt = existing.createdAt;

    const saved = bookingRepository.update(updatedRecord);
    activityLogService.registerBookingUpdate(actor.id, saved);
    return saved;
  },

  cancelBooking(bookingId: string, actor: Actor): void {
    if (!actor?.id) {
      throw ApiError.unauthorized();
    }

    const existing = bookingRepository.findById(bookingId);
    if (!existing) {
      throw ApiError.notFound("Reserva não encontrada");
    }

    if (existing.status === "cancelled") {
      return;
    }

    const cancelled = {
      ...existing,
      status: "cancelled" as const,
      notes: existing.notes,
    };

    const saved = bookingRepository.update(cancelled);
    activityLogService.registerBookingCancellation(actor.id, saved);
  },
};
