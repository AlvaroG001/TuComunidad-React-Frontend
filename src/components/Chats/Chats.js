import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Chats.css';

import perfilImg from '../Logos/Perfil.png';
import homeButtonImg from '../Logos/HomeButton.png';
import calendarButtonImg from '../Logos/CalendarButton.png';
import meetingButtonImg from '../Logos/MeetingButton.png';
import voteButtonImg from '../Logos/VoteButton.png';
import chatButtonImg from '../Logos/ChatButton.png';
import settingsButtonImg from '../Logos/SettingsButton.png';

function Chats({ logout }) {
    const location = useLocation();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [admin, setAdmin] = useState(false);

    const userDataString = localStorage.getItem('userData');
    const userData = JSON.parse(userDataString);

    useEffect(() => {
        fetchChats();
        if (location.state?.chat) {
            setSelectedChat(location.state.chat);
        }
    }, [location]);

    const fetchChats = async () => {
        const userDataString1 = localStorage.getItem('userData');
        const userData1 = JSON.parse(userDataString1);
        const communityId = userData1.comunidad.id;
        setAdmin(userData1.admin);

        try {
            const response = await fetch(`http://localhost:9000/api/chats?communityId=${communityId}`);
            if (response.ok) {
                const data = await response.json();
                const sortedData = data.sort((a, b) => b.id - a.id);
                setChats(sortedData.slice(0, 5));
            } else {
                throw new Error('Error al cargar los chats');
            }
        } catch (error) {
            console.error('Error al obtener los chat:', error);
        }
    };

    const handleUpdateChat = async () => {
        const userName = userData.name;

        if (newMessage === "") {
            return;
        } else {
            const updatedChat = {
                ...selectedChat,
                usuarios: [...selectedChat.usuarios, userName],
                chats: [...selectedChat.chats, newMessage]
            };
            console.log(newMessage);

            const response = await fetch(`http://localhost:9000/api/chats/${selectedChat.id}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedChat)
            });

            if (response.ok) {
                setNewMessage('');
                console.log(newMessage);
                setSelectedChat(updatedChat);
                fetchChats();
            } else {
                alert('Error al actualizar el chat');
            }
        }
    };

    const deleteChat = async (chatId) => {
        try {
            const response = await fetch(`http://localhost:9000/api/chats/${chatId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                alert('Votación eliminada con éxito');
                setChats(chats.filter(e => e.id !== chatId)); // Actualizar la lista de votaciones
                if (selectedChat.id === chatId) {
                    setSelectedChat(null); // Quitar la selección si la votación eliminada estaba seleccionada
                }
            } else {
                throw new Error('Failed to delete election');
            }
        } catch (error) {
            console.error('Error al eliminar la votación:', error);
            alert('Error al eliminar la votación: ' + error.message);
        }

    }

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

                {admin && (
                    <>
                        <Link to="/admin">
                            <img src={settingsButtonImg} alt="Settings" className="settings-button" />
                        </Link>
                        <span className="sidebar-label">Admin</span>
                    </>
                )}
            </aside>
            <main className="main-content">
                <header className="main-header-chat">
                    <h1>Chats - {userData.comunidad.name}</h1>
                    <div className="header-buttons">
                            <Link to="/create-chats" className="create-meeting-button">
                                Nuevo Chat
                            </Link>
                        <button onClick={logout} className="logout-button">Cerrar sesión</button>
                    </div>
                </header>
                <div className="chats-container">
                    {selectedChat && (
                        <div className="active-chat">
                            <>
                                <div className="introduction">
                                    <div className="titulo-boton">
                                        <h2 className="chat-titulo">{selectedChat.titulo}</h2>                                   
                                        <button className="delete-chat-button" onClick={() => deleteChat(selectedChat.id)}>Eliminar chat</button>  
                                    </div>                                 
                                    <div className="chat-usuario">
                                        <img src={perfilImg} alt="Perfil" className="perfil-user" />
                                        <h3>{selectedChat.sender}</h3>
                                    </div>
                                    <div className="chat-message">
                                        <p>{selectedChat.message}</p>
                                    </div>
                                </div>

                                <div className="conversation">
                                    {selectedChat.chats.map((mensaje, index) => (
                                        <div key={index} className={`chat ${selectedChat.usuarios[index] === userData.name ? 'chat-right' : 'chat-left'}`}>
                                            <div className="chat-usuario-inside">
                                                <img src={perfilImg} alt="Perfil" className="perfil-user-inside" />
                                                <p><strong>{selectedChat.usuarios[index]}</strong></p>
                                            </div>
                                            <pre className="chat-pre">
                                                <p className="mensaje-usuario">{mensaje}</p>
                                            </pre>
                                        </div>
                                    ))}
                                </div>
                                <div className="input-boton">
                                    <textarea
                                        name="mensaje"
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleUpdateChat();
                                            } else if (e.key === 'Enter' && e.shiftKey) {
                                                // Aquí puedes manejar el comportamiento de Shift+Enter si es necesario
                                            }
                                        }}
                                        className="mensaje-input" // Asegúrate de agregar esta clase
                                        placeholder="Escribe un mensaje..."
                                        required
                                    ></textarea>
                                    <button onClick={handleUpdateChat} className="boton-enviar">Enviar</button>
                                </div>
                            </>
                        </div>
                    )}

                    <div className="chat-details">
                        <h3>Últimas conversaciones</h3>
                        {chats.map(chat => (
                            <button className="ListChat-button" key={chat.id} onClick={() => { setSelectedChat(chat); console.log(); }}>
                                {chat.titulo}
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Chats;