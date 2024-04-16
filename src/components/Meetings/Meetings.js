import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Meetings.css';

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
function Meetings({ logout }) {
    const navigate = useNavigate();
    const [isPresident, setIsPresident] = useState(false);
    const [meetings, setMeetings] = useState([]);
    const [selectedMeeting, setSelectedMeeting] = useState(null);

    /**
     * Maneja la eliminación de una reunión.
     * 
     * @param {string} meetingId - ID de la reunión a eliminar.
     */
    const handleDeleteMeeting = async (meetingId) => {
        if(window.confirm('¿Estás seguro de que quieres eliminar esta reunión?')) {
            try {
                await fetch(`http://localhost:9000/api/reuniones/${meetingId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                alert('Reunión eliminada con éxito');
                navigate(0); // Recarga la página
            } catch (error) {
                console.error('Error al eliminar la reunión:', error);
            }
        }
    };

    useEffect(() => {
        const fetchMeetings = async () => {
            const userDataString = localStorage.getItem('userData');
            const userData = JSON.parse(userDataString);
            const comunityId = userData.comunity_id;
        
            setIsPresident(userData?.isPresident);
    
            try {
                const response = await fetch(`http://localhost:9000/api/reuniones?comunity_id=${comunityId}`);
                const data = await response.json();
                setMeetings(data.slice(-5)); // Guarda las últimas 5 reuniones
            } catch (error) {
                console.error('Error al obtener las reuniones:', error);
            }
        };

        fetchMeetings();
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
                    <h1>Próximas reuniones</h1>
                    <div className="header-buttons">
                        {isPresident && (
                            <Link to="/create-meetings" className="create-meeting-button">
                                Nueva Reunión
                            </Link>
                        )}
                        <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>
                    </div>
                </header>

                <div className="meetings-container">
                    <div className="meetings-list">
                        <h2 className="meetings-h2">Últimas reuniones registradas</h2>
                        {meetings.map(meeting => (
                            <button key={meeting._id} className="ListMeeting-button" onClick={() => setSelectedMeeting(meeting)}>
                                El {meeting.day} de {meeting.month} del {meeting.year} -- {meeting.hour}
                            </button>
                        ))}
                    </div>
                    {selectedMeeting && (
                        <div className="meeting-details">
                            {isPresident && (
                                <button className="delete-meeting-button" onClick={() => handleDeleteMeeting(selectedMeeting._id)}>
                                    Eliminar Reunión
                                </button>
                            )}
                            <h2>Detalles de la Reunión</h2>
                            <p>Día: {selectedMeeting.day}</p>
                            <p>Hora: {selectedMeeting.hour}</p>
                            <p>Mes: {selectedMeeting.month}</p>
                            <p>Año: {selectedMeeting.year}</p>
                            <p>Información: {selectedMeeting.information}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Meetings;
