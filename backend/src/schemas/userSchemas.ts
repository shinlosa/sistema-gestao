import { z } from "zod";

const baseUserFields = {
  username: z.string().trim().min(3, "Nome de usuário deve ter ao menos 3 caracteres"),
  password: z
    .string()
    .min(8, "Senha deve ter ao menos 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter letra minúscula")
    .regex(/[0-9]/, "Senha deve conter número"),
  name: z.string().trim().min(3, "Nome deve ter ao menos 3 caracteres"),
  email: z.string().trim().email("Email inválido"),
  role: z.enum(["admin", "editor", "usuario", "leitor"]),
  department: z.string().trim().max(100).optional(),
  status: z.enum(["active", "pending", "inactive", "suspended"]).optional(),
};

export const createUserSchema = z.object(baseUserFields);

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(3).optional(),
    email: z.string().trim().email().optional(),
    role: z.enum(["admin", "editor", "usuario", "leitor"]).optional(),
    department: z.string().trim().max(100).optional(),
    status: z.enum(["active", "pending", "inactive", "suspended"]).optional(),
    password: baseUserFields.password.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualização",
  });

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
