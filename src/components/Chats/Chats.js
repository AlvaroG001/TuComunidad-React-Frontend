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
    const [president, setPresident] = useState(false);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    const userDataString = localStorage.getItem('userData');
    const userData = JSON.parse(userDataString);

    useEffect(() => {

        fetchChats();

    }, []);

    const fetchChats = async () => {      
        const userDataString1 = localStorage.getItem('userData');
        const userData1 = JSON.parse(userDataString1);  
        const communityId = userData1.comunidad.id;

        setPresident(userData1?.president);

        const response = await fetch(`http://localhost:9000/api/chats?communityId=${communityId}`);
        const data = await response.json();
        setChats(data);
        setSelectedChat(data[data.length-1])
        console.log(data)
    };

    const handleUpdateChat = async () => {
        const userId = userData.id

        if(newMessage === ""){
            return   
        } else {
            const updatedChat = {
                ...selectedChat,
                usuarios: [...selectedChat.usuarios, userId],
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
                setSelectedChat(updatedChat);
                fetchChats();
            } else {
                alert('Error al actualizar el chat');
            }
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

                {president && (
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
                        {president && (
                            <Link to="/create-chats" className="create-meeting-button">
                                Nuevo Chat
                            </Link>
                        )}
                        <button onClick={logout} className="logout-button">Cerrar sesión</button>
                    </div>
                </header>
                <div className="meetings-container">
                    
                        {selectedChat && (
                            <div className="active-chat">
                            <>
                                <h2>{selectedChat.titulo}</h2>
                                <div className="chat-message">
                                    <p><strong>{selectedChat.sender}:</strong></p>
                                    <p>{selectedChat.message}</p>
                                </div>
                                {selectedChat.usuarios.map((usuario, index) => (
                                    <div key={index} className="chat">
                                        <h3>Usuario: {selectedChat.usuarios[index]}</h3>
                                        <p>Mensaje: {selectedChat.chats[index]}</p>
                                    </div>
                                ))}
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                />
                                <button onClick={handleUpdateChat}>Enviar</button>
                            </>
                            </div>
                        )}
                    
                    <div className="meeting-details">
                        <h3 className="meetings-h2">Chats de "{userData.comunidad.name}"</h3>
                        {chats.slice(0, 5).map(chat => (
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
