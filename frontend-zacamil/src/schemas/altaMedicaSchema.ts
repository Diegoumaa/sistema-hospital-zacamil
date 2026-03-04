import { z } from 'zod';

// Esquema FHIR para un alta médica (Encounter finalizado)
export const FhirEncounterSchema = z.object({
    resourceType: z.literal("Encounter"),
    status: z.literal("finished"),
    subject: z.object({
        reference: z.string().min(1, "El ID del paciente es obligatorio")
    }),
    location: z.array(
        z.object({
            location: z.object({
                reference: z.string().min(1, "El número de cama es obligatorio")
            })
        })
    ),
    practitioner: z.object({
        reference: z.string().min(1, "Falta la firma del médico")
    }),
    period: z.object({
        end: z.string().datetime()
    })
});

export type FhirEncounter = z.infer<typeof FhirEncounterSchema>;