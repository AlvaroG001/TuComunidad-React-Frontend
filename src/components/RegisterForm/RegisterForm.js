import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';

/**
 * Componente RegisterForm.
 * 
 * @returns {JSX.Element} Componente de formulario de registro de usuario.
 */
function RegisterForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    communityId: '',
    door: '',
    floor: '',
    isPresident: false,
    password: '',
  });

  const navigate = useNavigate();

  /**
   * Maneja el cambio en los campos del formulario.
   * 
   * @param {Event} e - Evento de cambio.
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({
      ...user,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  /**
   * Verifica si un usuario ya existe.
   * 
   * @returns {Promise<boolean>} Promesa que indica si el usuario existe.
   */
  const checkUserExists = async () => {
    const response = await fetch(`http://localhost:9000/api/users/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: user.email }), // Asegúrate de enviar correctamente el objeto con email
    });
    if (!response.ok) throw new Error('Error al verificar el usuario');
    const data = await response.json();
    return data;
  };


  

  /**
   * Maneja el envío del formulario de registro.
   * 
   * @param {Event} e - Evento de envío de formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userExists = await checkUserExists();
      if (userExists) {
        alert("El usuario con ese correo electrónico ya existe.");
        return;
      }
  
      const response = await fetch('http://localhost:9000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      console.log("Usuario registrado con éxito");
      navigate('/login');
    } catch (error) {
      console.error("Error durante el registro:", error);
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
          <input 
            type="text" 
            name="name" 
            value={user.name} 
            onChange={handleChange} 
            placeholder="Nombre completo" 
            required 
          />
          <input 
            type="email" 
            name="email" 
            value={user.email} 
            onChange={handleChange} 
            placeholder="Correo electrónico" 
            required 
          />
          <input 
            type="text" 
            name="communityId" 
            value={user.communityId} 
            onChange={handleChange} 
            placeholder="ID de comunidad" 
            required 
          />
          <input 
            type="text" 
            name="door" 
            value={user.door} 
            onChange={handleChange} 
            placeholder="Puerta" 
            required 
          />
          <input 
            type="text" 
            name="floor" 
            value={user.floor} 
            onChange={handleChange} 
            placeholder="Piso" 
            required 
          />
          <input 
            type="password" 
            name="password" 
            value={user.password} 
            onChange={handleChange} 
            placeholder="Contraseña" 
            required 
          />
          <button type="submit" className="register-button">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
