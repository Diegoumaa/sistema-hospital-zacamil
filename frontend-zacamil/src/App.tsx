import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  // Creamos una variable de estado. Empieza en 'false' (no logueado).
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Función que cambia el estado a 'true'
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <>
      {/* Esto es un renderizado condicional: 
        Si isLoggedIn es true, muestra el Dashboard.
        Si es false, muestra el Login y le pasa la función handleLogin.
      */}
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;