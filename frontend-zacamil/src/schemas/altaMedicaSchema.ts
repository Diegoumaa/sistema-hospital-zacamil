import { z } from 'zod';

// Schema para lo que enviamos (Request)
// Validamos que sea un string y que tenga formato de cama (opcional, pero robusto)
export const AltaMedicaRequestSchema = z.object({
    numeroCama: z.string().min(1, "El número de cama es obligatorio"),
});

// TypeScript infiere el tipo automáticamente desde el esquema de Zod
// Esto es magia: si cambias la validación, el tipo de TS se actualiza solo.
export type AltaMedicaRequest = z.infer<typeof AltaMedicaRequestSchema>;