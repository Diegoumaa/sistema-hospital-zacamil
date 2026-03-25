import apiClient from '../api/axiosClient';

export interface CamaLimpieza {
    id: number;
    numeroCama: string;
    estado: string;
}

export const getCamasContaminadas = async (): Promise<CamaLimpieza[]> => {
    // La url base del apiClient ya incluye la URL del API Gateway "/api/v1".
    const response = await apiClient.get<CamaLimpieza[]>('/limpieza/camas-contaminadas');
    return response.data;
};

export const marcarCamaLimpia = async (numeroCama: string): Promise<void> => {
    await apiClient.put(`/limpieza/camas/${numeroCama}/limpiar`);
};
