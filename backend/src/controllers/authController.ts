import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { authService } from "../services/authService.js";
import { userRepository } from "../repositories/index.js";

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

  me: async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return response.status(401).json({ message: "Não autenticado" });
      }

      const user = userRepository.findById(userId);
      if (!user) {
        return response.status(401).json({ message: "Usuário não encontrado" });
      }

      // Retornar usuário sem a senha
      const { password: _p, passwordHash: _h, ...userWithoutPassword } = user as Record<string, unknown>;
      return response.status(200).json({ user: userWithoutPassword });
    } catch (error) {
      return next(error);
    }
  },
};
