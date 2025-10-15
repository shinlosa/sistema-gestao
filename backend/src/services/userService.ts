import crypto from "node:crypto";
import { userRepository } from "../repositories/index.js";
import { User, UserStatus } from "../types/nami.js";
import { passwordUtils } from "../utils/password.js";
import { ApiError } from "../utils/apiError.js";

export type CreateUserInput = {
  username: string;
  password: string;
  name: string;
  email: string;
  role: User["role"];
  department?: string;
  status?: UserStatus;
  requestedBy?: string;
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
  role?: User["role"];
  department?: string;
  status?: UserStatus;
  password?: string;
};

const sanitizeEmail = (email: string): string => email.trim().toLowerCase();

const ensureUsernameUnique = (username: string) => {
  const existing = userRepository.findByUsername(username);
  if (existing) {
    throw ApiError.conflict("Nome de usuário já está em uso");
  }
};

const ensureEmailUnique = (email: string, ignoreUserId?: string) => {
  const existing = userRepository.list().find((user) => user.email.toLowerCase() === email && user.id !== ignoreUserId);
  if (existing) {
    throw ApiError.conflict("Email já está em uso");
  }
};

export const userService = {
  list() {
    return userRepository.list().map(({ passwordHash: _password, ...rest }) => rest);
  },

  async create(input: CreateUserInput, actorId: string): Promise<Omit<User, "passwordHash">> {
    ensureUsernameUnique(input.username);
    const email = sanitizeEmail(input.email);
    ensureEmailUnique(email);

    const passwordHash = await passwordUtils.hash(input.password);

    const now = new Date().toISOString();
    const user: User = {
      id: crypto.randomUUID(),
      username: input.username.trim(),
      passwordHash,
      name: input.name.trim(),
      email,
      role: input.role,
      department: input.department?.trim(),
      status: input.status ?? "pending",
      createdAt: now,
      lastLogin: undefined,
      requestedBy: input.requestedBy ?? actorId,
      approvedBy: undefined,
      approvedAt: input.status === "active" ? now : undefined,
    };

  const created = userRepository.create(user);
    const { passwordHash: _password, ...rest } = created;
    return rest;
  },

  async update(userId: string, input: UpdateUserInput): Promise<Omit<User, "passwordHash">> {
    const existing = userRepository.findById(userId);
    if (!existing) {
      throw ApiError.notFound("Usuário não encontrado");
    }

    const email = input.email ? sanitizeEmail(input.email) : existing.email;
    if (input.email) {
      ensureEmailUnique(email, userId);
    }

    let passwordHash = existing.passwordHash;
    if (input.password) {
      passwordHash = await passwordUtils.hash(input.password);
    }

    const updated: User = {
      ...existing,
      name: input.name?.trim() ?? existing.name,
      email,
      role: input.role ?? existing.role,
      department: input.department?.trim() ?? existing.department,
      status: input.status ?? existing.status,
      passwordHash,
    };

  const saved = userRepository.update(updated);
    const { passwordHash: _password, ...rest } = saved;
    return rest;
  },

  delete(userId: string, actorId: string): void {
    if (userId === actorId) {
      throw ApiError.badRequest("Não é possível excluir o próprio usuário");
    }

    const existing = userRepository.findById(userId);
    if (!existing) {
      throw ApiError.notFound("Usuário não encontrado");
    }

    userRepository.delete(userId);
  },
};
