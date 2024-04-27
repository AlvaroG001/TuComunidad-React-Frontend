import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';

function RegisterForm() {
  const [user, setUser] = useState({
      name: '',
      email: '',
      password: '',
      door: '',
      floor: '',
      isPresident: false,
      comunidad: { id: '' }
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      if (name === "communityId") {
          setUser(prev => ({ ...prev, comunidad: { id: value } }));
      } else {
          setUser({
              ...user,
              [name]: type === 'checkbox' ? checked : value
          });
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:9000/register', { // Asegúrate de que esta URL coincide con el backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
      });

      if (response.ok) {
        alert('User registered successfully.');
        navigate('/login');
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration error");
    }
  };


  return (
      <div className="register-background">
          <div className="register-wrapper">
              <div className="header-container">
                  <h2>Registro de usuario</h2>
                  <button onClick={() => navigate('/login')} className="back-button">Volver</button>
              </div>
              <form onSubmit={handleSubmit} className="register-form">
                  <input type="text" name="name" value={user.name} onChange={handleChange} placeholder="Nombre completo" required />
                  <input type="email" name="email" value={user.email} onChange={handleChange} placeholder="Correo electrónico" required />
                  <input type="text" name="communityId" value={user.comunidad.id} onChange={handleChange} placeholder="ID de comunidad" required />
                  <input type="text" name="door" value={user.door} onChange={handleChange} placeholder="Puerta" required />
                  <input type="text" name="floor" value={user.floor} onChange={handleChange} placeholder="Piso" required />
                  <input type="password" name="password" value={user.password} onChange={handleChange} placeholder="Contraseña" required />
                  <button type="submit" className="register-button">Registrarse</button>
              </form>
          </div>
      </div>
  );
}

export default RegisterForm;
