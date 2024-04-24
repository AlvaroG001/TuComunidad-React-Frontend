import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Chats.css';

import homeButtonImg from '../Logos/HomeButton.png';
import calendarButtonImg from '../Logos/CalendarButton.png';
import meetingButtonImg from '../Logos/MeetingButton.png';
import voteButtonImg from '../Logos/VoteButton.png';
import chatButtonImg from '../Logos/ChatButton.png';
import settingsButtonImg from '../Logos/SettingsButton.png';

function Chats({ logout }) {
    const [isPresident, setPresident] = useState(false);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        const fetchChats = async () => {
            const userDataString = localStorage.getItem('userData');
            if (!userDataString) {
                console.log("No user data available in local storage");
                return;
            }
    
            const userData = JSON.parse(userDataString);
            const communityId = userData?.comunidad?.id;
    
            if (!communityId) {
                console.error('No se encontró la información de la comunidad del usuario');
                return;
            }
    
            setPresident(userData?.president);
    
            try {
                const response = await fetch(`http://localhost:9000/api/chats?communityId=${communityId}`);
                if (response.ok) {
                    const data = await response.json();
                    setChats(data);
                } else {
                    throw new Error("Failed to fetch chats");
                }
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };
    
        fetchChats();
    }, []);
    


    const deleteChat = async (chatId) => {
        try {
            const response = await fetch(`http://localhost:9000/api/chats/${chatId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert('Chat eliminado con éxito');
                setChats(chats.filter(c => c.id !== chatId)); // Actualizar la lista de chats
                if (selectedChat && selectedChat.id === chatId) {
                    setSelectedChat(null); // Quitar la selección si el chat eliminado estaba seleccionado
                }
            } else {
                throw new Error('Error al eliminar el chat');
            }
        } catch (error) {
            console.error('Error al eliminar el chat:', error);
            alert('Error al eliminar el chat: ' + error.message);
        }
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
                        <button onClick={logout} className="logout-button">Cerrar sesión</button>
                    </div>
                </header>
                <div className="chats-container">
                    <div className="chats-list">
                        <h2 className="chats-h2">Últimos chats registrados</h2>
                        {chats.map(chat => (
                            <button key={chat.id || chat._id} className="chat-button" onClick={() => setSelectedChat(chat)}>
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
                            {isPresident && (
                                <button onClick={() => deleteChat(selectedChat.id)}>Eliminar Chat</button>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Chats;
