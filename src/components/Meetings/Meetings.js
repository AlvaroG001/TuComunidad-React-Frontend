import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation} from 'react-router-dom';
import './Meetings.css';

import homeButtonImg from '../Logos/HomeButton.png';
import calendarButtonImg from '../Logos/CalendarButton.png';
import meetingButtonImg from '../Logos/MeetingButton.png';
import voteButtonImg from '../Logos/VoteButton.png';
import chatButtonImg from '../Logos/ChatButton.png';
import settingsButtonImg from '../Logos/SettingsButton.png';

function Meetings({ logout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [president, setPresident] = useState(false);
    const [meetings, setMeetings] = useState([]);
    const [selectedMeeting, setSelectedMeeting] = useState(null);

    const userDataString = localStorage.getItem('userData');
    const userData = JSON.parse(userDataString);

    const handleDeleteMeeting = async (meetingId) => {
        if(window.confirm('¿Estás seguro de que quieres eliminar esta reunión?')) {
            try {
                const response = await fetch(`http://localhost:9000/api/reuniones/${meetingId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    alert('Reunión eliminada con éxito');
                    fetchMeetings(); // Recargar las reuniones después de borrar una
                    if (selectedMeeting && selectedMeeting.id === meetingId) {
                        setSelectedMeeting(null); // Limpiar la selección si la reunión eliminada estaba seleccionada
                    }
                }
            } catch (error) {
                console.error('Error al eliminar la reunión:', error);
            }
        }
    };

    const fetchMeetings = async () => {  
        const userDataString1 = localStorage.getItem('userData');
        const userData1 = JSON.parse(userDataString1);      
        const communityId = userData1.comunidad.id; // Asegúrate de que el objeto y la propiedad sean correctos
        
        setPresident(userData1?.president);
    
        try {
            const response = await fetch(`http://localhost:9000/api/reuniones?communityId=${communityId}`);
            if (response.ok) {
                const data = await response.json();

                // Asegúrate de que los datos se ordenen de más reciente (id más alto) a más antiguo antes de hacer el slice
                const sortedData = data.sort((a, b) => b.id - a.id);
                setMeetings(sortedData.slice(0, 5)); // Guarda las últimas 5 votaciones (las más recientes)
                // setSelectedMeeting(sortedData[0]); // Selecciona la votación más reciente como la votación seleccionada por defecto

            } else {
                throw new Error("Error al cargar las reuniones");
            }
        } catch (error) {
            console.error('Error al obtener las reuniones:', error);
        }
    };


    useEffect(() => {
        fetchMeetings();
        if (location.state?.meeting) {
            setSelectedMeeting(location.state.meeting);
        }
    }, [location]);


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
                    <h1>Próximas reuniones</h1>
                    <div className="header-buttons">
                        {president && (
                            <Link to="/create-meetings" className="create-meeting-button">
                                Nueva Reunión
                            </Link>
                        )}
                        <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>
                    </div>
                </header>

                <div className="meetings-container">
                    
                    <div className="meetings-list">
                        <h2 className="meetings-h2">Reuniones programadas en "{userData.comunidad.name}"</h2>
                        {meetings.map(meeting => (
                            <button key={meeting.id} className="ListMeeting-button" onClick={() => setSelectedMeeting(meeting)}>
                                El {meeting.day} de {meeting.month} del {meeting.year} -- {meeting.hour}
                            </button>
                        ))}
                    </div>

                    {selectedMeeting && (
                        <div className="meeting-details">
                            {president && (
                                <button className="delete-meeting-button" onClick={() => handleDeleteMeeting(selectedMeeting.id)}>
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
