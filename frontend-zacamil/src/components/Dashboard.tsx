import React, { useState, useEffect } from "react";
import axios from "axios";
import { altaMedicaService } from "../services/altaMedicaService";
import apiClient from "../api/axiosClient";
import { ZodError } from "zod";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type { FhirEncounter } from "../schemas/altaMedicaSchema";
import { SkeletonLoader } from "./ui/SkeletonLoader";
import { EmptyState } from "./ui/EmptyState";

interface Cama {
    id: string; // If available
    numeroCama: string;
    estado: string;
    pacienteActual: string | null;
}

export default function Dashboard() {
    const { medico, logout } = useAuth();
    const { addToast } = useToast();

    // Data lists
    const [camas, setCamas] = useState<Cama[]>([]);
    const [isLoadingCamas, setIsLoadingCamas] = useState(true);
    const [errorCamas, setErrorCamas] = useState("");

    // Modal and form states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCama, setSelectedCama] = useState<Cama | null>(null);
    const [diagnostico, setDiagnostico] = useState("");
    const [cargandoAlta, setCargandoAlta] = useState(false);

    // Ingreso states
    const [isModalIngresoOpen, setIsModalIngresoOpen] = useState(false);
    const [selectedCamaIngreso, setSelectedCamaIngreso] = useState<Cama | null>(null);
    const [nombrePaciente, setNombrePaciente] = useState("");
    const [cargandoIngreso, setCargandoIngreso] = useState(false);

    // Fetch camas
    const fetchCamas = async (controller?: AbortController) => {
        try {
            setIsLoadingCamas(true);
            setErrorCamas("");
            const response = await apiClient.get('/consultas/camas/disponibilidad', {
                signal: controller?.signal
            });
            const data = response.data;
            
            let camasArray: any[] = [];
            if (Array.isArray(data)) {
                camasArray = data;
            } else if (data && Array.isArray(data.content)) {
                camasArray = data.content;
            } else if (data && data._embedded) {
                const firstKey = Object.keys(data._embedded)[0]; 
                camasArray = data._embedded[firstKey] || [];
            } else if (data && Array.isArray(data.data)) {
                camasArray = data.data;
            }

            // 🛡️ Filtro estricto frontend: Asegura que el panel del doctor SOLAMENTE 
            // muestre y procese camas OCUPADAS o DISPONIBLES (para asignar pacientes).
            const camasOcupadas = camasArray.filter((c: any) => c.estado === 'OCUPADA' || c.estado === 'DISPONIBLE');
            
            setCamas(camasOcupadas.map((c: any) => ({
                id: c.id?.toString() || c.numeroCama.toString(),
                numeroCama: c.numeroCama.toString(),
                estado: c.estado,
                pacienteActual: c.pacienteActual || null
            })));

        } catch (err: any) {
            if (err.name === 'CanceledError') {
                console.log("Petición abortada");
                return;
            }
            console.error("Error fetching camas:", err);
            setErrorCamas("No se pudieron cargar las camas ocupadas.");
            addToast("Error al conectar con la base de datos de camas.", "error");
        } finally {
            setIsLoadingCamas(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchCamas(controller);
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const abrirModalAlta = (cama: Cama) => {
        setSelectedCama(cama);
        setDiagnostico("");
        setIsModalOpen(true);
    };

    const cerrarModal = () => {
        if (!cargandoAlta) {
            setIsModalOpen(false);
            setSelectedCama(null);
            setDiagnostico("");
        }
    };

    const abrirModalIngreso = (cama: Cama) => {
        setSelectedCamaIngreso(cama);
        setNombrePaciente("");
        setIsModalIngresoOpen(true);
    };

    const cerrarModalIngreso = () => {
        if (!cargandoIngreso) {
            setIsModalIngresoOpen(false);
            setSelectedCamaIngreso(null);
            setNombrePaciente("");
        }
    };

    const solicitarAlta = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCama) return;

        // Fallback robusto por inyecciones en base de datos.
        const pacienteId = selectedCama.pacienteActual || "DESCONOCIDO";

        setCargandoAlta(true);

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
                            reference: `Location/${selectedCama.numeroCama}`
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

            await altaMedicaService.procesarAlta(payload);
            addToast(`¡Alta médica generada exitosamente!`, 'success');
            
            cerrarModal();
            // Refrescar lista de camas para retirar la que dimos de alta
            fetchCamas();
            
        } catch (error) {
            console.error(error);

            if (error instanceof ZodError) {
                const firstIssueMessage = error.issues[0]?.message ?? 'Datos inválidos.';
                addToast(`Por favor verifique los datos: ${firstIssueMessage}`, 'error');
            } else if (error instanceof Error) {
                addToast(`Error al procesar el alta: ${error.message}`, 'error');
            } else {
                addToast('Ocurrió un error de red o de servidor. Por favor, vuelva a intentarlo.', 'error');
            }
        } finally {
            setCargandoAlta(false);
        }
    }

    const solicitarIngreso = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCamaIngreso || !nombrePaciente.trim()) return;

        setCargandoIngreso(true);

        try {
            await axios.post('http://localhost:8083/api/test/ingreso-paciente', {
                numeroCama: selectedCamaIngreso.numeroCama,
                nombrePaciente: nombrePaciente.trim()
            });
            addToast(`¡Proceso de ingreso iniciado exitosamente!`, 'success');
            
            cerrarModalIngreso();
            fetchCamas();
            
        } catch (error: any) {
            console.error(error);
            addToast(`Error al procesar el ingreso: ${error.message}`, 'error');
        } finally {
            setCargandoIngreso(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8 font-sans relative">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Panel Médico</h1>
                        <p className="text-slate-500 mt-1">Gestión Interactiva de Altas - Hospital Nacional Zacamil</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-800">{medico?.nombre}</p>
                            <p className="text-xs text-slate-500">{medico?.especialidad}</p>
                        </div>
                        <button 
                            onClick={logout} 
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition"
                        >
                            Salir
                        </button>
                    </div>
                </header>

                <div className="flex justify-end mb-6">
                    <button 
                        onClick={() => fetchCamas()}
                        className="bg-white border text-sm font-semibold border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg shadow-sm hover:bg-slate-50 hover:shadow-md transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Refrescar Vista
                    </button>
                </div>

                {isLoadingCamas ? (
                    <SkeletonLoader count={8} />
                ) : errorCamas ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-md shadow-sm">
                        <div className="flex items-center">
                            <svg className="h-6 w-6 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                            <p className="text-red-700 font-semibold">{errorCamas}</p>
                        </div>
                    </div>
                ) : camas.length === 0 ? (
                    <EmptyState 
                        title="Sin pacientes asignados" 
                        description="¡Gran labor! Actualmente no hay camas ocupadas con pacientes que requieran alta médica." 
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {camas.map((cama) => (
                            <div key={cama.id} className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-transform duration-300 flex flex-col group relative">
                                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                                <div className="p-6 flex-1 mt-1">
                                    <div className="flex justify-between items-start mb-5">
                                        <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 border border-blue-200">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                                            {cama.estado}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Cama {cama.numeroCama}</h3>
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4 mt-3">
                                        <p className="text-xs uppercase font-semibold text-slate-400 mb-1">Paciente Asignado</p>
                                        <p className={`font-medium ${!cama.pacienteActual ? 'text-red-500 italic' : 'text-slate-800'}`}>
                                            {cama.pacienteActual ? cama.pacienteActual : 'Error: ID No Vinculado'}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 mt-auto flex justify-between items-center group-hover:bg-slate-100 transition-colors">
                                    {cama.estado === 'DISPONIBLE' ? (
                                        <button 
                                            onClick={() => abrirModalIngreso(cama)}
                                            className="w-full font-semibold py-2.5 px-4 rounded-lg transition-all shadow-sm text-sm bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-4 focus:ring-emerald-100 active:scale-95 flex justify-center items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                                            Asignar Paciente
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => abrirModalAlta(cama)}
                                            disabled={!cama.pacienteActual}
                                            className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-all shadow-sm text-sm ${
                                                !cama.pacienteActual 
                                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-4 focus:ring-blue-100 active:scale-95 shadow-md flex justify-center items-center'
                                            }`}
                                        >
                                            {cama.pacienteActual ? 'Procesar Alta Médica' : 'Datos Incompletos'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de Alta Médica Superpuesto */}
            {isModalOpen && selectedCama && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-opacity">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transition-all transform opacity-100 scale-100">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-extrabold text-slate-800">Formulario Clínico</h2>
                            <button 
                                onClick={cerrarModal}
                                disabled={cargandoAlta}
                                className="text-slate-400 hover:text-red-500 bg-white rounded-full p-1 hover:bg-slate-100 focus:outline-none transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <form onSubmit={solicitarAlta} className="space-y-6">
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-bold text-slate-700">ID del Paciente</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                readOnly
                                                disabled
                                                value={selectedCama.pacienteActual || ''}
                                                className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2.5 text-sm text-slate-600 focus:outline-none focus:ring-0 cursor-not-allowed font-semibold shadow-inner"
                                            />
                                            <svg className="w-5 h-5 absolute right-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-bold text-slate-700">Número Cama</label>
                                        <input
                                            type="text"
                                            readOnly
                                            disabled
                                            value={selectedCama.numeroCama}
                                            className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2.5 text-sm text-slate-600 focus:outline-none focus:ring-0 cursor-not-allowed font-semibold shadow-inner"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="diagnostico" className="mb-1.5 block text-sm font-bold text-slate-700">
                                        Diagnóstico / Motivo de Alta
                                    </label>
                                    <textarea
                                        id="diagnostico"
                                        required
                                        rows={4}
                                        value={diagnostico}
                                        onChange={(e) => setDiagnostico(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-shadow resize-none shadow-sm"
                                        placeholder="Ingrese el reporte clínico de culminación de tratamiento u observaciones médicas..."
                                    />
                                </div>

                                <div className="rounded-lg bg-blue-50/70 p-4 border border-blue-200 flex items-start mt-2">
                                    <svg className="h-6 w-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <div>
                                        <h4 className="text-sm font-extrabold text-blue-900 mb-0.5">Certificación Médica Digital</h4>
                                        <p className="text-xs text-blue-800 leading-relaxed font-medium">
                                            Al procesar el alta, la transacción FHIR quedará rígidamente firmada y asociada a las credenciales del <strong>Dr. {medico?.nombre}</strong> (Reg: {medico?.idPractitioner}).
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={cerrarModal}
                                        disabled={cargandoAlta}
                                        className="w-1/3 py-2.5 px-4 bg-white border border-slate-300 rounded-lg shadow-sm text-sm font-bold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={cargandoAlta}
                                        className={`w-2/3 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-extrabold text-white focus:outline-none focus:ring-4 focus:ring-blue-200 transition-colors ${
                                            cargandoAlta ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                                        }`}
                                    >
                                        {cargandoAlta ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Generando...
                                            </span>
                                        ) : 'Efectuar Alta Clínica'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Ingreso */}
            {isModalIngresoOpen && selectedCamaIngreso && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-opacity">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transition-all transform opacity-100 scale-100">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-extrabold text-slate-800">Asignar Paciente</h2>
                            <button 
                                onClick={cerrarModalIngreso}
                                disabled={cargandoIngreso}
                                className="text-slate-400 hover:text-red-500 bg-white rounded-full p-1 hover:bg-slate-100 focus:outline-none transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <form onSubmit={solicitarIngreso} className="space-y-6">
                                <div>
                                    <label className="mb-1.5 block text-sm font-bold text-slate-700">Número de Cama</label>
                                    <input
                                        type="text"
                                        readOnly
                                        disabled
                                        value={selectedCamaIngreso.numeroCama}
                                        className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2.5 text-sm text-slate-600 focus:outline-none focus:ring-0 cursor-not-allowed font-semibold shadow-inner"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="nombrePaciente" className="mb-1.5 block text-sm font-bold text-slate-700">
                                        Nombre del Paciente
                                    </label>
                                    <input
                                        type="text"
                                        id="nombrePaciente"
                                        required
                                        value={nombrePaciente}
                                        onChange={(e) => setNombrePaciente(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-shadow shadow-sm"
                                        placeholder="Ingrese el nombre completo del paciente..."
                                    />
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={cerrarModalIngreso}
                                        disabled={cargandoIngreso}
                                        className="w-1/3 py-2.5 px-4 bg-white border border-slate-300 rounded-lg shadow-sm text-sm font-bold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={cargandoIngreso}
                                        className={`w-2/3 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-extrabold text-white focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-colors ${
                                            cargandoIngreso ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                                        }`}
                                    >
                                        {cargandoIngreso ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Asignando...
                                            </span>
                                        ) : 'Asignar Paciente'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}