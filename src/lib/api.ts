import type { Monitoring, NAMIBooking, NAMIRoom, User } from "../types/nami";

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

export interface UsersResponse {
  users: ApiUser[];
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
  getUsers: () => apiFetch<UsersResponse>("/auth/users"),
  getHealth: () => apiFetch<{ status: string }>("/health"),
};

export { API_BASE_URL, ApiError };
export type { ApiUser, ApiBooking };
