import apiClient from '../api/axiosClient';
import type { FhirEncounter } from '../schemas/altaMedicaSchema';
import { FhirEncounterSchema } from '../schemas/altaMedicaSchema';
import { AxiosError } from 'axios';

export const altaMedicaService = {
    /**
     * Envía una solicitud de alta médica al API Gateway.
     * @param data Objeto con la información FHIR del alta
     */
    procesarAlta: async (data: FhirEncounter) => {
        // 1. Validación de Runtime con Zod (Robustez preventiva)
        // Antes de salir a internet, verificamos que nuestros datos estén bien.
        const validData = FhirEncounterSchema.parse(data);

        try {
            // 2. Hacemos la petición usando nuestra instancia configurada
            const response = await apiClient.post('/altas', validData);
            return response.data; // Retornamos solo los datos, no toda la respuesta HTTP

        } catch (error) {
            // 3. Manejo de errores centralizado
            if (error instanceof AxiosError) {
                // Buscamos el mensaje dinámico del GlobalExceptionHandler del backend (ej: "La cama 101 no existe")
                const backendMessage = error.response?.data?.message;
                throw new Error(backendMessage || 'Error de conexión con el servidor hospitalario');
            }
            throw error;
        }
    }
};