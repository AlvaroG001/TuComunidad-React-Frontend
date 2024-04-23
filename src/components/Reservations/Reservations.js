import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Reservations.css';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import homeButtonImg from '../Logos/HomeButton.png';
import calendarButtonImg from '../Logos/CalendarButton.png';
import meetingButtonImg from '../Logos/MeetingButton.png';
import voteButtonImg from '../Logos/VoteButton.png';
import chatButtonImg from '../Logos/ChatButton.png';
import settingsButtonImg from '../Logos/SettingsButton.png';

const localizer = momentLocalizer(moment);

/**
 * Componente Reservations.
 * 
 * @param {function} logout - Función para cerrar sesión.
 * @returns {JSX.Element} Componente de la página de reservas.
 */
function Reservations({ logout }) {
    const navigate = useNavigate();
    const [isPresident, setIsPresident] = useState(false);
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);

    useEffect(() => {
        const fetchReservations = async () => {
            const userDataString = localStorage.getItem('userData');
            const userData = JSON.parse(userDataString);
            const comunityId = userData.comunity_id;
        
            setIsPresident(userData?.isPresident);
    
            try {
                const response = await fetch(`http://localhost:9000/api/reservas?comunity_id=${comunityId}`);
                const data = await response.json();
                setReservations(data);
            } catch (error) {
                console.error('Error al obtener las reservas:', error);
            }
        };

        fetchReservations();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSelectEvent = (event) => {
        const { start, end } = event;
        setSelectedReservation({
            day: moment(start).format('D'),
            month: moment(start).format('MMMM'),
            year: moment(start).format('YYYY'),
            hour: moment(start).format('LT'),
            endHour: moment(end).format('LT'),
            information: event.information
        });
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
                    <h1>Reservas</h1>
                    <div className="header-buttons">
                        {isPresident && (
                            <Link to="/create-reservation" className="create-reservation-button">
                                Nueva Reserva
                            </Link>
                        )}
                        <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>
                    </div>
                </header>

                <div className="meetings-container">
                    <Calendar
                        localizer={localizer}
                        events={reservations.map(reservation => ({
                            start: new Date(reservation.start),
                            end: new Date(reservation.end),
                            information: reservation.information
                        }))}
                        views={['week']}
                        onSelectEvent={handleSelectEvent}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                    />
                    
                    {selectedReservation && (
                        <div className="reservation-details">
                            <h2>Detalles de la Reserva</h2>
                            <p>Día: {selectedReservation.day}</p>
                            <p>Mes: {selectedReservation.month}</p>
                            <p>Año: {selectedReservation.year}</p>
                            <p>Hora de inicio: {selectedReservation.hour}</p>
                            <p>Hora de fin: {selectedReservation.endHour}</p>
                            <p>Información: {selectedReservation.information}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Reservations;
