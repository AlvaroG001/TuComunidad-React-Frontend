import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';

import homeButtonImg from '../Logos/HomeButton.png';
import calendarButtonImg from '../Logos/CalendarButton.png';
import meetingButtonImg from '../Logos/MeetingButton.png';
import voteButtonImg from '../Logos/VoteButton.png';
import chatButtonImg from '../Logos/ChatButton.png';
import settingsButtonImg from '../Logos/SettingsButton.png';

/**
 * Componente Home.
 * 
 * @param {Function} logout - Función para cerrar sesión.
 * @returns {JSX.Element} Componente de la página de inicio.
 */
function Home({ logout }) {
  const navigate = useNavigate();
  const [communityName, setCommunityName] = useState('Tu Comunidad');
  const [president, setPresident] = useState(false);

  useEffect(() => {
    const fetchCommunityName = async () => {
      const userDataString = localStorage.getItem('userData');
      const userData = JSON.parse(userDataString);
      setCommunityName(userData ? userData.comunidad.name : null);

      setPresident(userData?.president);
    };

    fetchCommunityName();
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar el componente

  /**
   * Maneja el evento de cierre de sesión.
   */
  const handleLogout = () => {
    logout(); // Llama a la función logout proporcionada por App.js
    navigate('/login'); // Redirige al usuario a la página de inicio de sesión
  };

  return (
    <div className="home-container">
      <aside className="sidebar">
        <Link to="/home">
          <img src={homeButtonImg} alt="Home" className="home-button" />
        </Link>
        <span className="sidebar-label">Inicio</span>
        <Link to="/reservations">
          <img src={calendarButtonImg} alt="Calendar" className="calendar-button" />
        </Link>
        <span className="sidebar-label">Reservas</span> 
        <Link to="/meetings">
          <img src={meetingButtonImg} alt="Meeting" className="meeting-button" />
        </Link>
        <span className="sidebar-label">Reuniones</span>
        <Link to="/votes">
          <img src={voteButtonImg} alt="Vote" className="vote-button" />
        </Link>
        <span className="sidebar-label">Votaciones</span>
        <Link to="/chats">
          <img src={chatButtonImg} alt="Chat" className="chat-button" />
        </Link>
        <span className="sidebar-label">Chats</span>

        {president && (
          <>
            <Link to="/settings">
              <img src={settingsButtonImg} alt="Settings" className="settings-button" />
            </Link>
            <span className="sidebar-label">Ajustes</span>
          </>
        )}

        {/* Iconos y enlaces de la barra lateral */}
      </aside>
      <main className="main-content">
        <header className="main-header">
          <h1>Bienvenido a "{communityName}"</h1>
          <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>
        </header>
        {/* Resto de tu contenido principal */}
      </main>
    </div>
  );
}

export default Home;
