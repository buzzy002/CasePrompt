import { z } from 'zod';

export const gameStateSchema = z.object({
    phase: z.enum(['investigation', 'resolution', 'finished']),
    done: z.array(z.string()),
    items: z.array(z.string()),
    conditions: z.array(z.string()),
    actionsLeft: z.int().min(0),
});
export type GameState = z.infer<typeof gameStateSchema>;

const pastTurnSchema = z.object({
    player: z.string().max(500),
    narration: z.string().max(2000),
});

export const turnRequestSchema = z.object({
    text: z
        .string({ error: 'Écris ce que tu fais' })
        .trim()
        .min(1, { error: 'Écris ce que tu fais' })
        .max(500, { error: 'Ton action doit faire moins de 500 caractères' }),
    state: gameStateSchema,
    history: z
        .array(pastTurnSchema)
        .max(5, { error: "L'historique contient au plus 5 tours" }),
});
export type TurnRequestDto = z.infer<typeof turnRequestSchema>;

export const turnResponseSchema = z.object({
    narration: z.string(),
    action: z.string().nullable(),
    result: z.string().nullable(),
    itemsGained: z.array(z.string()),
    state: gameStateSchema,
});
export type TurnResponseDto = z.infer<typeof turnResponseSchema>;