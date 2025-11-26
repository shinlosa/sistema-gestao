import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { activityLogService } from "../services/activityLogService.js";
import { authService } from "../services/authService.js";

const loginSchema = z.object({
  username: z.string().min(1, "Usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const authController = {
  login: async (request: Request, response: Response, next: NextFunction) => {
    const parseResult = loginSchema.safeParse(request.body);

    if (!parseResult.success) {
      return response.status(400).json({
        message: "Credenciais inválidas",
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { username, password } = parseResult.data;

    try {
      const loginResult = await authService.login(username, password);

      if (!loginResult) {
        return response.status(401).json({ message: "Credenciais inválidas" });
      }

      // Não registrar evento de login no log de atividades

      return response.status(200).json(loginResult);
    } catch (error) {
      return next(error);
    }
  },
  logout: async (request: Request, response: Response) => {
    const actorId = request.user?.id ?? "";
    if (actorId) {
      await activityLogService.register(
        "Logout",
        `Usuário desconectado: ${request.user?.name ?? actorId}`,
        actorId,
        actorId,
        request.ip,
        String(request.headers["user-agent"] ?? ""),
      );
    }
    return response.status(204).send();
  },
};
