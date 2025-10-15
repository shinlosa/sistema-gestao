import { z } from "zod";

const timeSlotArraySchema = z
  .array(z.string().trim().min(1, "Horário inválido"))
  .nonempty("Selecione ao menos um horário");

const dateSchema = z
  .string()
  .trim()
  .refine((value) => {
    if (!value) return false;
    const parsed = new Date(value);
    return !Number.isNaN(parsed.getTime());
  }, "Data inválida");

const baseSchema = {
  roomId: z.string().trim().min(1, "Sala é obrigatória"),
  date: dateSchema,
  timeSlots: timeSlotArraySchema,
  responsible: z.string().trim().min(1, "Responsável é obrigatório"),
  serviceType: z.string().trim().min(1, "Tipo de atendimento é obrigatório"),
  notes: z
    .string()
    .trim()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .optional()
    .nullable()
    .transform((value) => (value ? value : undefined)),
};

export const createBookingSchema = z.object({
  ...baseSchema,
});

export const updateBookingSchema = z.object({
  ...baseSchema,
  status: z.enum(["confirmed", "pending", "cancelled"]).optional(),
});

export type CreateBookingSchema = z.infer<typeof createBookingSchema>;
export type UpdateBookingSchema = z.infer<typeof updateBookingSchema>;
