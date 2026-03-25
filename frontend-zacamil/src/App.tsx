import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PanelLimpieza from './components/PanelLimpieza';
import { useState } from 'react';

function AppContent() {
  const { medico } = useAuth();
  const [vistaActual, setVistaActual] = useState<'medico' | 'limpieza'>('medico');

  return (
    <>
      {medico ? (
        <div className="flex flex-col h-screen bg-slate-50">
          <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
            <h1 className="text-xl font-bold tracking-wide flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              Hospital Zacamil
            </h1>
            <div className="flex gap-3">
              <button 
                onClick={() => setVistaActual('medico')}
                className={`px-4 py-2 rounded-lg transition-all text-sm font-semibold shadow-sm ${vistaActual === 'medico' ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Panel Médico
              </button>
              <button 
                onClick={() => setVistaActual('limpieza')}
                className={`px-4 py-2 rounded-lg transition-all text-sm font-semibold shadow-sm ${vistaActual === 'limpieza' ? 'bg-emerald-600 text-white shadow-emerald-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Panel Limpieza
              </button>
            </div>
          </nav>
          <div className="flex-1 overflow-auto">
            {vistaActual === 'medico' ? <Dashboard /> : <PanelLimpieza />}
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;