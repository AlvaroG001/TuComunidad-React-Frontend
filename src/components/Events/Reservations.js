import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-modal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Reservations.css';

import perfilImg from '../Logos/Perfil.png';
import homeButtonImg from '../Logos/HomeButton.png';
import calendarButtonImg from '../Logos/CalendarButton.png';
import meetingButtonImg from '../Logos/MeetingButton.png';
import voteButtonImg from '../Logos/VoteButton.png';
import chatButtonImg from '../Logos/ChatButton.png';
import settingsButtonImg from '../Logos/SettingsButton.png';

const localizer = momentLocalizer(moment);
Modal.setAppElement('#root');

function Events({ logout }) {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const [president, setPresident] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [facilities, setFacilities] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState('');
    const [facilityName, setFacilityName] = useState('Seleccione una instalación');



    const userDataString = localStorage.getItem('userData');
    const userData = JSON.parse(userDataString);

    const eventStyleGetter = (event, start, end, isSelected) => {
        var style = {
            backgroundColor: '#3174ad',
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        return {
            style: style
        };
    };

    const fetchEventsForFacility = async (facilityId) => {
        try {
            const response = await fetch(`http://localhost:9000/api/events?facilityId=${facilityId}`);
            if (response.ok) {
                const data = await response.json();
                setEvents(data.map(event => ({
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end)
                })));
            } else {
                throw new Error('Failed to fetch events');
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleFacilitySelect = (facility) => {
        setSelectedFacility(facility);
        fetchEventsForFacility(facility.id);
    };

    useEffect(() => {
        fetchFacilities();
    }, []); // Se asegura de que las instalaciones se carguen al montar el componente


    useEffect(() => {
        const updateFacilityName = () => {
            const selected = facilities.find(f => f.id.toString() === selectedFacility);
            if (selected) {
                setFacilityName(selected.name);
            } else {
                setFacilityName('Instalación no encontrada');
            }
        };

        if (selectedFacility) {
            updateFacilityName();
        }
    }, [selectedFacility, facilities]); // Depende tanto de selectedFacility como de facilities




    const fetchFacilities = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/facilities');
            if (response.ok) {
                const facilities = await response.json();
                setFacilities(facilities);
            } else {
                throw new Error('Failed to fetch facilities');
            }
        } catch (error) {
            console.error('Error fetching facilities:', error);
        }
    };


    const handleAddEvent = async () => {
        const event = {
            title,
            startTime: start,
            endTime: end,
            comunidad: userData.comunidad
        };

        try {
            const response = await fetch(`http://localhost:9000/api/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event)
            });
            if (response.ok) {
                const newEvent = await response.json();
                setEvents([...events, { ...newEvent, start: new Date(newEvent.startTime), end: new Date(newEvent.endTime) }]);
                closeModal();
                alert('Evento creado exitosamente');
            } else {
                throw new Error('Error al crear el evento');
            }
        } catch (error) {
            console.error('Error al crear un nuevo evento:', error);
            alert('Error al crear el evento: ' + error.message);
        }
        fetchEventsForFacility();
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            const response = await fetch(`http://localhost:9000/api/events/${eventId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setEvents(events.filter(event => event.id !== eventId));
                setDeleteModalIsOpen(false);
                alert('Evento eliminado exitosamente');
            } else {
                const errorText = await response.text();
                throw new Error('Error al eliminar el evento: ' + errorText);
            }
        } catch (error) {
            console.error('Error al eliminar el evento:', error);
            alert('Error al eliminar el evento: ' + error.message);
        }
        fetchEventsForFacility();
    };


    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);
    const openDeleteModal = () => setDeleteModalIsOpen(true);
    const closeDeleteModal = () => setDeleteModalIsOpen(false);

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
                    <h1>Calendario de Eventos de la Comunidad</h1>

                    <button onClick={logout} className="logout-button">Cerrar sesión</button>
                    <button onClick={openDeleteModal} className="delete-event-button">Eliminar Reserva</button>
                    <button onClick={openModal} className="add-event-button">Reservar</button>
                </header>
                <div className='reservations-container'>

                    <div className="calendar-container">
                        {selectedFacility && (
                            <div className="reservations-details">
                                <h2 className="vote-title" >{facilityName}</h2>
                            </div>
                        )}
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 500 }}
                            onSelectEvent={event => setSelectedEvent(event)}
                            views={['day', 'week', 'month']}
                            defaultView={Views.WEEK}
                            eventPropGetter={eventStyleGetter}
                        />
                    </div>

                    <div className="reservations-details">
                        <h3 className="reservations-h2">Instalaciones de "{userData.comunidad.name}"</h3>
                        <ul className="facility-list">
                            {facilities.map(facility => (
                                <li key={facility.id} onClick={() => setSelectedFacility(facility.id)}>
                                    {facility.name}
                                </li>
                            ))}
                        </ul>
                    </div>



                    {selectedEvent && (
                        <div className="event-details">
                            <h2>{selectedEvent.title}</h2>
                            <img src={perfilImg} alt="Perfil" className="perfil-user" />
                            <p>Inicio: {moment(selectedEvent.start).format('LLL')}</p>
                            <p>Fin: {moment(selectedEvent.end).format('LLL')}</p>
                        </div>
                    )}
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        contentLabel="Añadir Evento"
                        className="Modal"
                        overlayClassName="Overlay"
                    >
                        <h2>Reserva en {facilityName}</h2>
                        <form>
                            <input type="text" placeholder="Título del evento" value={title} onChange={e => setTitle(e.target.value)} />
                            <input type="datetime-local" value={moment(start).format('YYYY-MM-DDTHH:mm')} onChange={e => setStart(new Date(e.target.value))} />
                            <input type="datetime-local" value={moment(end).format('YYYY-MM-DDTHH:mm')} onChange={e => setEnd(new Date(e.target.value))} />
                            <button type="button" onClick={handleAddEvent}>Guardar Reserva</button>
                            <button type="button" onClick={closeModal}>Cancelar</button>
                        </form>
                    </Modal>

                    <Modal
                        isOpen={deleteModalIsOpen}
                        onRequestClose={closeDeleteModal}
                        contentLabel="Eliminar Evento"
                        className="Modal"
                        overlayClassName="Overlay"
                    >
                        <h2>Seleccione una reserva para eliminar</h2>
                        {events.map(event => (
                            <div key={event.id} className="event-list-item">
                                <span>{event.title} - {moment(event.start).format('LLL')}</span>
                                <button onClick={() => handleDeleteEvent(event.id)}>Eliminar</button>
                            </div>
                        ))}
                    </Modal>
                </div>
            </main>
        </div>
    );
}

export default Events;
