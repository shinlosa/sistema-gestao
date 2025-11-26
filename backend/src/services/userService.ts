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

const ensureUsernameUnique = async (username: string) => {
  const existing = await userRepository.findByUsername(username);
  if (existing) {
    throw ApiError.conflict("Nome de usuário já está em uso");
  }
};

const ensureEmailUnique = async (email: string, ignoreUserId?: string) => {
  const existing = await userRepository.findByEmail(email);
  if (existing && existing.id !== ignoreUserId) {
    throw ApiError.conflict("Email já está em uso");
  }
};

export const userService = {
  async list() {
    const users = await userRepository.list();
    return users.map(({ passwordHash: _password, ...rest }) => rest);
  },

  async create(input: CreateUserInput, actorId: string): Promise<Omit<User, "passwordHash">> {
    await ensureUsernameUnique(input.username);
    const email = sanitizeEmail(input.email);
    await ensureEmailUnique(email);

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

    const created = await userRepository.create(user);
    const { passwordHash: _password, ...rest } = created;
    return rest;
  },

  async update(userId: string, input: UpdateUserInput): Promise<Omit<User, "passwordHash">> {
    const existing = await userRepository.findById(userId);
    if (!existing) {
      throw ApiError.notFound("Usuário não encontrado");
    }

    const email = input.email ? sanitizeEmail(input.email) : existing.email;
    if (input.email) {
      await ensureEmailUnique(email, userId);
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

    const saved = await userRepository.update(updated);
    const { passwordHash: _password, ...rest } = saved;
    return rest;
  },

  async changeRole(userId: string, newRole: User["role"], _actorId: string): Promise<Omit<User, "passwordHash">> {
    const existing = await userRepository.findById(userId);
    if (!existing) {
      throw ApiError.notFound("Usuário não encontrado");
    }

    const updated: User = {
      ...existing,
      role: newRole,
    };

    const saved = await userRepository.update(updated);
    const { passwordHash: _password, ...rest } = saved;
    return rest;
  },

  async approve(userId: string, actorId: string): Promise<Omit<User, "passwordHash">> {
    const existing = await userRepository.findById(userId);
    if (!existing) {
      throw ApiError.notFound("Usuário não encontrado");
    }

    const now = new Date().toISOString();
    const updated: User = {
      ...existing,
      status: "active",
      approvedBy: actorId,
      approvedAt: now,
    };

    const saved = await userRepository.update(updated);
    const { passwordHash: _password, ...rest } = saved;
    return rest;
  },

  async reject(userId: string, _actorId: string): Promise<void> {
    const existing = await userRepository.findById(userId);
    if (!existing) {
      throw ApiError.notFound("Usuário não encontrado");
    }

    // For a reject, remove the requested user record
    await userRepository.delete(userId);
  },

  async suspend(userId: string, actorId: string): Promise<void> {
    // When requested to "suspend" a user, the system now deletes the account
    // instead of marking it suspended. Reuse the existing delete logic which
    // enforces self-deletion protections and not-found checks.
    await userService.delete(userId, actorId);
  },

  reactivate(_userId: string, _actorId: string): Promise<Omit<User, "passwordHash">> {
    // Re-activation is not supported: accounts are deleted permanently.
    throw ApiError.badRequest("Reativação não suportada: contas são excluídas permanentemente");
  },

  async delete(userId: string, actorId: string): Promise<void> {
    if (userId === actorId) {
      throw ApiError.badRequest("Não é possível excluir o próprio usuário");
    }

    const existing = await userRepository.findById(userId);
    if (!existing) {
      throw ApiError.notFound("Usuário não encontrado");
    }

    await userRepository.delete(userId);
  },
};
