import { useAuth } from '../context/AuthContext';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { useEffect } from "react";
import { InteractionStatus } from "@azure/msal-browser";

export default function Login() {
    const { loginMedico } = useAuth();
    // Extraemos "inProgress" para saber en qué paso va Microsoft
    const { instance, accounts, inProgress } = useMsal();

    useEffect(() => {
        console.log("⏳ Estado actual de MSAL:", inProgress);
        console.log("👤 Cuentas detectadas en React:", accounts);

        // Si MSAL ya terminó de cargar ("None") y sí hay una cuenta, entramos.
        if (inProgress === InteractionStatus.None && accounts.length > 0) {
            console.log("🎉 ¡Login validado! Redirigiendo al Dashboard...");
            loginMedico();
        }
    }, [accounts, inProgress, loginMedico]);

    const handleMicrosoftLogin = () => {
        console.log("🚀 Iniciando viaje hacia Microsoft...");
        instance.loginRedirect(loginRequest);
    };

    // PANTALLA DE CARGA: Si MSAL está procesando (ej. regresando de Azure), mostramos esto.
    if (inProgress !== InteractionStatus.None) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-100">
                <div className="text-center">
                    <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]"></div>
                    <h2 className="text-xl font-semibold text-slate-700">Validando credenciales...</h2>
                    <p className="text-slate-500">Conectando de forma segura con Azure</p>
                </div>
            </div>
        );
    }

    // Si MSAL está inactivo y no hay cuentas, mostramos el Login normal
    return (
        <div className="flex h-screen items-center justify-center bg-slate-100">
            <div className="w-full max-w-md rounded-xl bg-white p-10 shadow-lg border border-slate-200">
                <h2 className="mb-2 text-center text-3xl font-bold text-slate-800">Hospital Zacamil</h2>
                <p className="mb-8 text-center text-slate-500 font-medium">Portal Institucional Seguro</p>
                <button
                    type="button"
                    onClick={handleMicrosoftLogin}
                    className="w-full flex items-center justify-center gap-3 rounded-lg bg-[#2F2F2F] px-4 py-3.5 text-white font-semibold hover:bg-black focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all shadow-md"
                >
                    <svg className="w-5 h-5" viewBox="0 0 23 23" fill="currentColor">
                        <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                        <path fill="#f35325" d="M1 1h10v10H1z"/>
                        <path fill="#81bc06" d="M12 1h10v10H12z"/>
                        <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                        <path fill="#ffba08" d="M12 12h10v10H12z"/>
                    </svg>
                    Iniciar sesión con Microsoft
                </button>
                <p className="mt-6 text-center text-xs text-slate-400">Protegido por Microsoft Entra ID</p>
            </div>
        </div>
    );
}