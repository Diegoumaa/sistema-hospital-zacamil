export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Panel Médico</h1>
                <p className="text-gray-600">Bienvenido al Sistema de Gestión Hospitalaria</p>
            </header>

            <main className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-semibold text-blue-700">Acciones Rápidas</h2>
                
                <p className="mb-6 text-gray-600">
                    Desde aquí puedes gestionar las altas de los pacientes. Al hacer clic en el botón, 
                    nos comunicaremos con el API Gateway.
                </p>

                <button
                    type="button"
                    className="rounded-md bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                    Dar de Alta a Paciente de Prueba
                </button>
            </main>
        </div>
    );
}