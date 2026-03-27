import axios from 'axios';

// Creamos una instancia centralizada de Axios
const apiClient = axios.create({
   baseURL: 'http://localhost:8082/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000, // Si el backend tarda más de 5s, cancelamos (Robustez)
});

export default apiClient;