import { NextFunction, Request, Response } from "express";
import { activityLogService } from "../services/activityLogService.js";
import { userService } from "../services/userService.js";
import { createUserSchema, updateUserSchema } from "../schemas/userSchemas.js";

export const userController = {
  list: (_request: Request, response: Response) => {
    const users = userService.list();
    return response.json({ users });
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
      activityLogService.register("Gerenciar Usuário", `Usuário criado: ${user.name}`, actorId, user.id);
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
      activityLogService.register("Gerenciar Usuário", `Usuário atualizado: ${user.name}`, actorId, user.id);
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
      activityLogService.register("Gerenciar Usuário", `Usuário removido: ${userId}`, actorId, userId);
      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  },
};