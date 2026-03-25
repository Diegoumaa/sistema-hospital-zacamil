import React, { useEffect, useState } from 'react';
import { getCamasContaminadas, type CamaLimpieza } from '../services/limpiezaService';

const PanelLimpieza: React.FC = () => {
    const [camas, setCamas] = useState<CamaLimpieza[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCamas = async () => {
        try {
            setLoading(true);
            const data = await getCamasContaminadas();
            setCamas(data);
            setError('');
        } catch (err: any) {
            console.error(err);
            setError('Error al obtener camas. Verifique conexión al servidor.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCamas();
    }, []);

    return (
        <div className="p-8 h-full min-h-full">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Panel de Limpieza</h2>
                        <p className="text-slate-500 mt-1">Gestión de camas que requieren desinfección ('CONTAMINADA')</p>
                    </div>
                    <button 
                        onClick={fetchCamas}
                        className="bg-white border text-sm font-semibold border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg shadow-sm hover:bg-slate-50 hover:shadow-md transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Refrescar
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                        <p className="text-slate-500 font-medium">Buscando tareas pendientes...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-md shadow-sm">
                        <div className="flex items-center">
                            <svg className="h-6 w-6 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                            <p className="text-red-700 font-semibold">{error}</p>
                        </div>
                    </div>
                ) : camas.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center animate-fade-in transition-all">
                        <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-5 shadow-inner">
                            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">¡Todo impecable!</h3>
                        <p className="text-slate-500 text-lg">No hay camas contaminadas asignadas en el sistema en este instante.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {camas.map((cama) => (
                            <div key={cama.id} className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-transform duration-300 flex flex-col group relative">
                                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                                <div className="p-6 flex-1 mt-1">
                                    <div className="flex justify-between items-start mb-5">
                                        <div className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 border border-amber-200">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
                                            {cama.estado}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Cama {cama.numeroCama}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-4">Requiere limpieza profunda e higienización del área por protocolo de alta médica.</p>
                                </div>
                                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 mt-auto flex justify-between items-center group-hover:bg-slate-100 transition-colors">
                                    <span className="text-xs font-semibold text-slate-500 uppercase">Acción Requerida</span>
                                    <button 
                                        onClick={() => {
                                            alert("Lógica de marcaje de limpieza no implementada (scope no contemplado).");
                                        }}
                                        className="bg-slate-800 hover:bg-slate-900 focus:ring-4 focus:ring-slate-300 text-white font-semibold py-2 px-5 rounded-lg transition-all shadow-md active:scale-95 text-sm"
                                    >
                                        Marcar Limpia
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PanelLimpieza;
