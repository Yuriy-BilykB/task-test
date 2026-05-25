import { z } from "zod";

export const createTodoSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Task text is required")
    .max(255, "255 characters max"),
  categoryId: z.string().min(1, "Pick a category"),
});

export type CreateTodoFormValues = z.infer<typeof createTodoSchema>;
