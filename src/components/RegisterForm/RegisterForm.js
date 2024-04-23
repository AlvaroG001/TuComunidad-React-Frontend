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

  const checkUserExists = async () => {
      const response = await fetch(`http://localhost:9000/api/usuarios/check-email`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: user.email })
      });
      if (!response.ok) throw new Error('Error al verificar el usuario');
      return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userExists = await checkUserExists();
      if (userExists) {
          alert("El usuario con ese correo electrónico ya existe.");
          return;
      }
      const response = await fetch('http://localhost:9000/api/usuarios', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(user)
      });

      if (response.ok) {
          console.log("Usuario registrado con éxito");
          alert("Usuario registrado con éxito.");
          navigate('/login');
      } else if (response.status === 400) {
          const errorMessage = await response.text();
          alert(errorMessage); // Muestra un mensaje de error específico sobre la comunidad no encontrada
      } else {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
        console.error("Error durante el registro:", error);
        alert("Ha ocurrido un error durante el registro. Por favor, verifica los datos e inténtalo de nuevo.");
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
