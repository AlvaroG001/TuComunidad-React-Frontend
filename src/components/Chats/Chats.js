import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Chats.css'; // Asegúrate de importar el CSS

import homeButtonImg from '../Logos/HomeButton.png';
import calendarButtonImg from '../Logos/CalendarButton.png';
import meetingButtonImg from '../Logos/MeetingButton.png';
import voteButtonImg from '../Logos/VoteButton.png';
import chatButtonImg from '../Logos/ChatButton.png';
import settingsButtonImg from '../Logos/SettingsButton.png';

/**
 * Componente Meetings.
 * 
 * @param {function} logout - Función para cerrar sesión.
 * @returns {JSX.Element} Componente de la página de reuniones.
 */
function Chats({ logout }) {
    const navigate = useNavigate();
    const [isPresident, setIsPresident] = useState(false);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        const fetchChats = async () => {
            const userDataString = localStorage.getItem('userData');
            const userData = JSON.parse(userDataString);

            setIsPresident(userData?.isPresident);
        };

        fetchChats();
    }, []);


    /**
     * Maneja el cierre de sesión del usuario.
     */
    const handleLogout = () => {
        logout();
        navigate('/login');
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

                {isPresident && (
                    <>
                        <Link to="/settings">
                            <img src={settingsButtonImg} alt="Settings" className="settings-button" />
                        </Link>
                        <span className="sidebar-label">Ajustes</span>
                    </>
                )}
            </aside>
            <main className="main-content">
                <header className="main-header">
                    <h1>Chat de la Comunidad</h1>
                    <div className="header-buttons">
                        <Link to="/create-chats" className="create-chat-button">
                            Nuevo Chat
                        </Link>

                        <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>
                    </div>
                </header>
                <div className="chats-container">
                    <div className="chats-list">
                        <h2 className="chats-h2">Últimos chats registrados</h2>
                        {chats.map(chat => (
                            <button key={chat._id} className="chat-button" onClick={() => setSelectedChat(chat)}>
                                {chat.sender}: {chat.message}
                            </button>
                        ))}
                    </div>
                    {selectedChat && (
                        <div className="chat-details">
                            <h2>Detalles del Chat</h2>
                            <p>Remitente: {selectedChat.sender}</p>
                            <p>Mensaje: {selectedChat.message}</p>
                            <p>Fecha: {selectedChat.timestamp}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Chats;