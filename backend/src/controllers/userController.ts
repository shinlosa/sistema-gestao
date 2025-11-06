import { NextFunction, Request, Response } from "express";
import { activityLogService } from "../services/activityLogService.js";
import { userService } from "../services/userService.js";
import { User } from "../types/nami.js";
import { createUserSchema, updateUserSchema } from "../schemas/userSchemas.js";

export const userController = {
  list: (request: Request, response: Response) => {
    // Simple pagination (in-memory). Clients may pass ?page and ?perPage
    const page = Math.max(1, Number(request.query.page ?? 1));
    const perPage = Math.max(1, Math.min(100, Number(request.query.perPage ?? 20)));

    const all = userService.list();
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const offset = (page - 1) * perPage;
    const users = all.slice(offset, offset + perPage);

    return response.json({ users, meta: { total, page, perPage, totalPages } });
  },

  create: async (request: Request, response: Response, next: NextFunction) => {
    const parseResult = createUserSchema.safeParse(request.body);

    if (!parseResult.success) {
      const { fieldErrors } = parseResult.error.flatten();
      return response.status(400).json({
        message: "Dados inválidos",
        errors: fieldErrors,
      });
    }

    try {
      const actorId = request.user?.id ?? "";
      const user = await userService.create(parseResult.data, actorId);
      activityLogService.register(
        "Gerenciar Usuário",
        `Usuário criado: ${user.name}`,
        actorId,
        user.id,
        request.ip,
        String(request.headers["user-agent"] ?? ""),
      );
      return response.status(201).json({ user });
    } catch (error) {
      return next(error);
    }
  },

  update: async (request: Request, response: Response, next: NextFunction) => {
    const parseResult = updateUserSchema.safeParse(request.body);

    if (!parseResult.success) {
      const { fieldErrors } = parseResult.error.flatten();
      return response.status(400).json({
        message: "Dados inválidos",
        errors: fieldErrors,
      });
    }

    try {
      const userId = request.params.userId;
      const actorId = request.user?.id ?? "";
      const user = await userService.update(userId, parseResult.data);
      activityLogService.register(
        "Gerenciar Usuário",
        `Usuário atualizado: ${user.name}`,
        actorId,
        user.id,
        request.ip,
        String(request.headers["user-agent"] ?? ""),
      );
      return response.status(200).json({ user });
    } catch (error) {
      return next(error);
    }
  },

  delete: (request: Request, response: Response, next: NextFunction) => {
    try {
      const userId = request.params.userId;
      const actorId = request.user?.id ?? "";
      userService.delete(userId, actorId);
      activityLogService.register(
        "Gerenciar Usuário",
        `Usuário removido: ${userId}`,
        actorId,
        userId,
        request.ip,
        String(request.headers["user-agent"] ?? ""),
      );
      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  },

  changeRole: (request: Request, response: Response, next: NextFunction) => {
    try {
      const userId = request.params.userId;
      const actorId = request.user?.id ?? "";
      const { role } = request.body as { role?: string };

      if (!role) {
        return response.status(400).json({ message: "Role é obrigatório" });
      }

      const allowedRoles = ["admin", "editor", "usuario", "leitor"];
      if (!allowedRoles.includes(role)) {
        return response.status(400).json({ message: "Role inválido" });
      }

      const user = userService.changeRole(userId, role as User["role"], actorId);
      activityLogService.register(
        "Gerenciar Usuário",
        `Função alterada: ${user.name} => ${user.role}`,
        actorId,
        user.id,
        request.ip,
        String(request.headers["user-agent"] ?? ""),
      );
      return response.status(200).json({ user });
    } catch (error) {
      return next(error);
    }
  },

  approve: (request: Request, response: Response, next: NextFunction) => {
    try {
      const userId = request.params.userId;
      const actorId = request.user?.id ?? "";
      const user = userService.approve(userId, actorId);
      activityLogService.register(
        "Gerenciar Usuário",
        `Usuário aprovado: ${user.name}`,
        actorId,
        user.id,
        request.ip,
        String(request.headers["user-agent"] ?? ""),
      );
      return response.status(200).json({ user });
    } catch (error) {
      return next(error);
    }
  },

  reject: (request: Request, response: Response, next: NextFunction) => {
    try {
      const userId = request.params.userId;
      const actorId = request.user?.id ?? "";
      userService.reject(userId, actorId);
      activityLogService.register(
        "Gerenciar Usuário",
        `Solicitação rejeitada: ${userId}`,
        actorId,
        userId,
        request.ip,
        String(request.headers["user-agent"] ?? ""),
      );
      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  },

  suspend: (request: Request, response: Response, next: NextFunction) => {
    try {
      const userId = request.params.userId;
      const actorId = request.user?.id ?? "";
      // Suspend now deletes the user permanently
      userService.suspend(userId, actorId);
      activityLogService.register(
        "Gerenciar Usuário",
        `Usuário removido via ação 'suspend': ${userId}`,
        actorId,
        userId,
        request.ip,
        String(request.headers["user-agent"] ?? ""),
      );
      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  },

  reactivate: (request: Request, response: Response) => {
    // Re-activation is not supported because accounts are deleted when suspended
    return response.status(400).json({ message: "Reativação não suportada: contas são excluídas permanentemente" });
  },
};