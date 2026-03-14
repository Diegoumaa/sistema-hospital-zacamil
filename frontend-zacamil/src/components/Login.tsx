import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { loginMedico } = useAuth();

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                
                <h2 className="mb-6 text-center text-2xl font-bold text-blue-800">
                    Hospital Zacamil
                </h2>
                <p className="mb-6 text-center text-gray-600">
                    Acceso al Sistema de Alta Médica
                </p>

                <form className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                    Usuario
                    </label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Ingrese su usuario"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                    Contraseña
                    </label>
                    <input
                        type="password"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="button"
                    onClick={() => loginMedico()}
                    className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Ingresar
                </button>
                </form>

            </div>
        </div>
    );
}