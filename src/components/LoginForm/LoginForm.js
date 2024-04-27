import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import background from './FondoLogin.png';
import './LoginForm.css';

function LoginForm({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:9000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      if (response.ok) {
        const userData = await response.json();
        sessionStorage.setItem('userData', JSON.stringify(userData));
        setIsAuthenticated(true);
        navigate('/home');
      } else {
        const errorText = await response.text();
        alert(`Authentication failed! Server responded with: ${errorText}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login error: " + error.message);
    }
  };





  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-background" style={{ backgroundImage: `url(${background})` }}>
      <div className="login-wrapper">
        <div className="left-container">
          <h1>TuComunidad</h1>
          <p>Gestiona fácilmente tu comunidad, conecta con tus vecinos y transforma tu entorno en un lugar aún mejor.</p>
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
