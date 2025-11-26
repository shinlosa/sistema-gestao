/// <reference types="vite/client" />

import type { Monitoring, NAMIBooking, NAMIRoom, User, RevisionRequest, ActivityLog } from "../types/nami";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3333/api";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers ?? undefined);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Authorization") && typeof window !== "undefined") {
    const token = window.localStorage.getItem("nami-auth-token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("Content-Type");
  const isJson = contentType?.includes("application/json");
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = isJson && body && typeof body.message === "string" ? body.message : response.statusText;
    throw new ApiError(message || "Erro desconhecido", response.status);
  }

  return body as T;
}

type ApiUser = Omit<User, "createdAt" | "lastLogin" | "approvedAt"> & {
  createdAt: string;
  lastLogin?: string;
  approvedAt?: string;
};

type ApiBooking = Omit<NAMIBooking, "date" | "createdAt"> & {
  date: string;
  createdAt: string;
};

export interface LoginResponse {
  user: ApiUser;
  token: string;
}

export interface MonitoringsResponse {
  monitorings: Monitoring[];
}

export interface RoomsResponse {
  rooms: NAMIRoom[];
}

export interface BookingsResponse {
  bookings: ApiBooking[];
}

export interface CreateBookingBody {
  roomId: string;
  date: string; // yyyy-mm-dd or ISO
  timeSlots: string[];
  responsible: string;
  serviceType: string;
  notes?: string;
}

export interface UpdateBookingBody extends CreateBookingBody {}

export interface UsersResponse {
  users: ApiUser[];
}

export interface RevisionRequestsResponse {
  revisionRequests: Array<
    Omit<RevisionRequest, "date" | "createdAt"> & { date: string; createdAt: string }
  >;
}

export interface CreateRevisionRequestBody {
  roomId: string;
  roomNumber: number;
  roomName: string;
  date: string; // ISO
  timeSlots: string[];
  responsible: string;
  serviceType: string;
  justification: string;
}

export interface ActivityLogsResponse {
  logs: Array<
    Omit<ActivityLog, "timestamp"> & { timestamp: string }
  >;
}

export const api = {
  login: (username: string, password: string) =>
    apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  getMonitorings: () => apiFetch<MonitoringsResponse>("/nami/monitorings"),
  getRooms: () => apiFetch<RoomsResponse>("/nami/rooms"),
  getBookings: () => apiFetch<BookingsResponse>("/nami/bookings"),
  createBooking: (body: CreateBookingBody) =>
    apiFetch<{ booking: ApiBooking }>("/nami/bookings", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateBooking: (bookingId: string, body: UpdateBookingBody) =>
    apiFetch<{ booking: ApiBooking }>(`/nami/bookings/${bookingId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  cancelBooking: (bookingId: string) =>
    apiFetch<void>(`/nami/bookings/${bookingId}`, { method: "DELETE" }),
  getUsers: () => apiFetch<UsersResponse>("/auth/users"),
  getHealth: () => apiFetch<{ status: string }>("/health"),
  // User management actions
  changeUserRole: (userId: string, role: string) =>
    apiFetch<{ user: ApiUser }>(`/users/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),
  approveUser: (userId: string) => apiFetch<{ user: ApiUser }>(`/users/${userId}/approve`, { method: "POST" }),
  rejectUser: (userId: string) => apiFetch<void>(`/users/${userId}/reject`, { method: "POST" }),
  suspendUser: (userId: string) => apiFetch<void>(`/users/${userId}`, { method: "DELETE" }),
  reactivateUser: (userId: string) => apiFetch<{ user: ApiUser }>(`/users/${userId}/reactivate`, { method: "POST" }),
  deleteUser: (userId: string) => apiFetch<void>(`/users/${userId}`, { method: "DELETE" }),
  logout: () => apiFetch<void>(`/auth/logout`, { method: "POST" }),
  getActivityLogs: () => apiFetch<ActivityLogsResponse>("/nami/activity-logs"),
  // Revision Requests
  getRevisionRequests: () => apiFetch<RevisionRequestsResponse>("/nami/revision-requests"),
  createRevisionRequest: (body: CreateRevisionRequestBody) =>
    apiFetch<{ request: CreateRevisionRequestBody & { id: string } }>("/nami/revision-requests", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  approveRevisionRequest: (id: string) =>
    apiFetch<{ request: unknown }>(`/nami/revision-requests/${id}/approve`, { method: "POST" }),
  rejectRevisionRequest: (id: string) =>
    apiFetch<{ request: unknown }>(`/nami/revision-requests/${id}/reject`, { method: "POST" }),
};

export { API_BASE_URL, ApiError };
export type { ApiUser, ApiBooking };
