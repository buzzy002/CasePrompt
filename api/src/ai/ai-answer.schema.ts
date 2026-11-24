import { z } from 'zod';

// Snake case: these are the names the system prompt asks the model for.
export const aiAnswerSchema = z.object({
  action: z.string().nullable(),
  new_condition: z.string().max(100).nullable(),
  removed_condition: z.string().max(100).nullable(),
  narration: z.string().trim().min(1),
});
export type AiAnswer = z.infer<typeof aiAnswerSchema>;
