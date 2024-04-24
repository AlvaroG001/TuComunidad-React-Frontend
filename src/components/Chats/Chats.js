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
    const [replyMessage, setReplyMessage] = useState('');
    const [replies, setReplies] = useState([]);

    const fetchChats = async () => {
        const userDataString = localStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        const communityId = userData?.comunidad?.id;
        setPresident(userData?.president);

        try {
            const response = await fetch(`http://localhost:9000/api/chats?communityId=${communityId}`);
            if (response.ok) {
                const data = await response.json();
                setChats(data);
            } else {
                console.error("Failed to fetch chats");
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    useEffect(() => {
        fetchChats();
    }, []);

    const selectChat = async (chat) => {
        setSelectedChat(chat);
        setReplyMessage('');
        try {
            const response = await fetch(`http://localhost:9000/api/chats/${chat.id}/replies`);
            if (response.ok) {
                const repliesData = await response.json();
                setReplies(repliesData);
            } else {
                setReplies([]);
                console.error("Failed to fetch replies");
            }
        } catch (error) {
            console.error('Error fetching replies:', error);
            setReplies([]);
        }
    };

    const sendReply = async (e) => {
        e.preventDefault();
        if (!selectedChat) return;

        try {
            const response = await fetch(`http://localhost:9000/api/chats/${selectedChat.id}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: replyMessage, sender: 'Current User' })
            });

            if (response.ok) {
                alert('Reply sent successfully');
                setReplyMessage('');
                selectChat(selectedChat);  // Refresh the chat details
            } else {
                throw new Error('Failed to send reply');
            }
        } catch (error) {
            console.error('Error sending reply:', error);
            alert('Error sending reply: ' + error.message);
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
                alert('Chat eliminado con éxito');
                setChats(chats.filter(c => c.id !== chatId));
                setSelectedChat(null);
                setReplies([]);
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
                                <div key={chat.id} className="chat-entry" onClick={() => selectChat(chat)}>
                                    <div className="chat-message">
                                        {chat.sender}: {chat.message}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {selectedChat && (
                            <div className="chat-details">
                                <h2>Detalles del Chat</h2>
                                <p>Remitente: {selectedChat.sender}</p>
                                <p>Mensaje: {selectedChat.message}</p>
                                <p>Fecha: {selectedChat.timestamp}</p>
                                <div>
                                    <h3>Respuestas:</h3>
                                    {replies.map(reply => (
                                        <div key={reply.id} className="reply-entry">
                                            <p>{reply.sender}: {reply.message}</p>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={sendReply}>
                                    <input
                                        type="text"
                                        value={replyMessage}
                                        onChange={e => setReplyMessage(e.target.value)}
                                        placeholder="Escribe una respuesta..."
                                    />
                                    <button type="submit">Enviar</button>
                                </form>
                                {selectedChat.replies && selectedChat.replies.map(reply => (
                                    <div key={reply.id} className="reply-entry">
                                        <p>{reply.sender}: {reply.message}</p>
                                    </div>
                                ))}
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
