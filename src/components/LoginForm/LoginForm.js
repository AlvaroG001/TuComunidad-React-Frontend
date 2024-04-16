import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import background from './FondoLogin.png';
import './LoginForm.css';

/**
 * Componente LoginForm.
 * 
 * @param {function} setIsAuthenticated - Función para establecer el estado de autenticación.
 * @returns {JSX.Element} Componente de formulario de inicio de sesión.
 */
function LoginForm({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const navigate = useNavigate();

  /**
   * Maneja el evento de inicio de sesión.
   * 
   * @param {Event} event - Evento del formulario.
   */
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:9000/api/users/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
  
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('userData', JSON.stringify(userData));
        setIsAuthenticated(true);
        navigate('/home');
      } else if (response.status === 404) {
        alert("Usuario no encontrado");
      } else if (response.status === 401) {
        alert("Contraseña incorrecta");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };
  

  /**
   * Cambia la visibilidad de la contraseña.
   */
  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  /**
   * Redirige al usuario a la página de registro.
   */
  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-background" style={{ backgroundImage: `url(${background})` }}>
      <div className="login-wrapper">
        <div className="left-container">
          <h1>TuComunidad</h1>
          <p>Gestiona fácilmente tu comunidad, conecta con tus vecinos y transforma tu entorno en un lugar aún mejor.</p>
          {/* Iconos de redes sociales irían aquí */}
        </div>
        <div className="right-container">
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Usuario o Correo electrónico"
              required
            />
            <div className="password-container">
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="show-password"
              >
                {isPasswordVisible ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <button type="submit" className="login-button">Iniciar sesión</button>
            <button type="button" className="register-button" onClick={goToRegister}>Registrarse</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
