import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './css/sb-admin-2.min.css';
import Menu from './Menu';
import Login from './Login';

function App() {
  // Estado para saber si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para manejar el login
  const handleLogin = (authenticated) => {
    setIsAuthenticated(authenticated);  // Actualiza el estado de autenticación
  };

  return (
    <div>
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />  // Si no está autenticado, mostramos Login
      ) : (
        <Menu />  // Si está autenticado, mostramos el menú
      )}
    </div>
  );
}

export default App;
