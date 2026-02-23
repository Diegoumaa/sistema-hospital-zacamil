import { useState } from "react";
import { altaMedicaService } from "../services/altaMedicaService";
import { ZodError } from "zod";

export default function Dashboard() {

    const [mensaje, setMensaje] = useState<string>('');
    const [cargando, setCargando] = useState<boolean>(false);

    const solicitarAlta = async () => {
        setCargando(true);
        setMensaje('');

        try {
            // Llamamos al servicio, le pasamos el objeto.
            // Si intenta pasar { cama: 123 } TypeScript gritaria error aqui mismo
            const respuesta = await altaMedicaService.procesarAlta({
                numeroCama: "102" // usamos la cama que sabemos que existe en la BD
            });

            setMensaje(`¡Éxito! Operación completada: ${respuesta}`);
            
        } catch (error) {
            console.error(error);

            // Manejo de errores segun tipo
            if (error instanceof ZodError) {
                // Si falló la validación de datos antes de enviarse
                const firstIssueMessage = error.issues[0]?.message ?? 'Datos inválidos.';
                setMensaje(`Error de validación: ${firstIssueMessage}`);
            } else if (error instanceof Error) {
                // si fallo el servicio o la red
                setMensaje(error.message);
            } else {
                setMensaje('Ocurrió un error inesperado.');
            }
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Panel Médico</h1>
                <p className="text-gray-600">Bienvenido al Sistema de Gestión Hospitalaria</p>
            </header>

            <main className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-semibold text-blue-700">Acciones Rápidas</h2>
                <p className="mb-6 text-gray-600">
                    Gestión de Altas Médicas (Arquitectura Robusta)
                </p>

                <button
                    type="button"
                    onClick={solicitarAlta}
                    disabled={cargando}
                    className={`rounded-md px-6 py-3 font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                        cargando ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {cargando ? 'Procesando...' : 'Dar de Alta a Cama 102'}
                </button>

                {mensaje && (
                <div className={`mt-6 rounded-md p-4 border ${mensaje.includes('Éxito') ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                    {mensaje}
                </div>
                )}
            </main>
        </div>
    );
}