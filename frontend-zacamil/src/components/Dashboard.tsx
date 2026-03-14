import { useState } from "react";
import { altaMedicaService } from "../services/altaMedicaService";
import { ZodError } from "zod";
import { useAuth } from "../context/AuthContext";
import type { FhirEncounter } from "../schemas/altaMedicaSchema";

export default function Dashboard() {
    const { medico, logout } = useAuth();

    const [pacienteId, setPacienteId] = useState("");
    const [numeroCama, setNumeroCama] = useState("");
    const [diagnostico, setDiagnostico] = useState("");

    const [mensaje, setMensaje] = useState<string>('');
    const [cargando, setCargando] = useState<boolean>(false);

    const solicitarAlta = async (e: React.FormEvent) => {
        e.preventDefault();
        setCargando(true);
        setMensaje('');

        try {
            const payload: FhirEncounter = {
                resourceType: "Encounter",
                status: "finished",
                subject: {
                    reference: `Patient/${pacienteId}`
                },
                location: [
                    {
                        location: {
                            reference: `Location/CAMA-${numeroCama}`
                        }
                    }
                ],
                practitioner: {
                    reference: `Practitioner/${medico?.idPractitioner}`
                },
                period: {
                    end: new Date().toISOString()
                }
            };

            const respuesta = await altaMedicaService.procesarAlta(payload);
            setMensaje(`¡Éxito! Operación completada: ${JSON.stringify(respuesta)}`);
            
            // Limpiar formulario tras éxito (opcional)
            setPacienteId("");
            setNumeroCama("");
            setDiagnostico("");
            
        } catch (error) {
            console.error(error);

            if (error instanceof ZodError) {
                const firstIssueMessage = error.issues[0]?.message ?? 'Datos inválidos.';
                setMensaje(`Error de validación: ${firstIssueMessage}`);
            } else if (error instanceof Error) {
                setMensaje(error.message);
            } else {
                setMensaje('Ocurrió un error inesperado.');
            }
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Panel Médico</h1>
                    <p className="text-gray-500 mt-1">Hospital Nacional Zacamil - Módulo de Altas</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-700">{medico?.nombre}</p>
                        <p className="text-xs text-gray-500">{medico?.especialidad}</p>
                    </div>
                    <button 
                        onClick={logout} 
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition"
                    >
                        Salir
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-2xl rounded-xl bg-white p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-semibold text-blue-800">Solicitud de Alta Médica</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Complete el formulario para registrar el alta en el estándar FHIR.
                    </p>
                </div>

                <form onSubmit={solicitarAlta} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="pacienteId" className="mb-1.5 block text-sm font-medium text-gray-700">
                                ID del Paciente
                            </label>
                            <input
                                id="pacienteId"
                                type="text"
                                required
                                value={pacienteId}
                                onChange={(e) => setPacienteId(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
                                placeholder="Ej: 12345"
                            />
                        </div>

                        <div>
                            <label htmlFor="numeroCama" className="mb-1.5 block text-sm font-medium text-gray-700">
                                Número de Cama
                            </label>
                            <select
                                id="numeroCama"
                                required
                                value={numeroCama}
                                onChange={(e) => setNumeroCama(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white transition-shadow"
                            >
                                <option value="" disabled>Seleccione una cama</option>
                                <option value="101">Cama 101 - Observación</option>
                                <option value="102">Cama 102 - Recuperación</option>
                                <option value="205">Cama 205 - Cuidados Intensivos</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="diagnostico" className="mb-1.5 block text-sm font-medium text-gray-700">
                            Diagnóstico / Motivo de Alta
                        </label>
                        <textarea
                            id="diagnostico"
                            required
                            rows={3}
                            value={diagnostico}
                            onChange={(e) => setDiagnostico(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow resize-none"
                            placeholder="Detalle el motivo del alta o notas para el paciente..."
                        />
                    </div>

                    <div className="rounded-md bg-blue-50 p-4 border border-blue-100">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">Firma Electrónica</h3>
                                <div className="mt-1 text-sm text-blue-700">
                                    <p>Esta acción será firmada digitalmente por: <strong>{medico?.nombre}</strong> (ID: {medico?.idPractitioner})</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={cargando}
                            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                                cargando ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                            }`}
                        >
                            {cargando ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando FHIR...
                                </span>
                            ) : 'Generar Alta Médica'}
                        </button>
                    </div>

                    {mensaje && (
                        <div className={`mt-4 rounded-md p-4 text-sm font-medium border ${
                            mensaje.includes('Éxito') ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'
                        }`}>
                            {mensaje}
                        </div>
                    )}
                </form>
            </main>
        </div>
    );
}