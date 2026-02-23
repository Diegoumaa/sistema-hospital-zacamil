import apiClient from '../api/axiosClient';
import type { AltaMedicaRequest } from '../schemas/altaMedicaSchema';
import { AltaMedicaRequestSchema } from '../schemas/altaMedicaSchema';
import { AxiosError } from 'axios';

export const altaMedicaService = {
    /**
     * Envía una solicitud de alta médica al API Gateway.
     * @param data Objeto con la información de la cama
     */
    procesarAlta: async (data: AltaMedicaRequest) => {
        // 1. Validación de Runtime con Zod (Robustez preventiva)
        // Antes de salir a internet, verificamos que nuestros datos estén bien.
        const validData = AltaMedicaRequestSchema.parse(data);

        try {
            // 2. Hacemos la petición usando nuestra instancia configurada
            const response = await apiClient.post('/altas', validData);
            return response.data; // Retornamos solo los datos, no toda la respuesta HTTP

        } catch (error) {
            // 3. Manejo de errores centralizado
            if (error instanceof AxiosError) {
                // Error conocido de Axios (ej: 404, 500, sin internet)
                throw new Error(error.response?.data || 'Error de conexión con el servidor');
            }
            // Error desconocido (ej: error de código nuestro)
            throw error;
        }
    }
};