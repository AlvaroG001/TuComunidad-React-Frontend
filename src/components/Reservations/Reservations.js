import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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


const localizer = momentLocalizer(moment);
Modal.setAppElement('#root');

function Reservations({ logout }) {
    const location = useLocation();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [instalaciones, setInstalaciones] = useState('');
    const [communityDetails, setCommunityDetails] = useState({});



    const userDataString = localStorage.getItem('userData');
    const userData = JSON.parse(userDataString);

    const installationNames = {
        cinema: 'Cine',
        gym: 'Gimnasio',
        library: 'Biblioteca',
        pool: 'Piscina',
        padel: 'Pista de Pádel'
    };

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

    const fetchEvents = async () => {
        const url = `http://localhost:9000/api/reservations?instalaciones=${instalaciones}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setEvents(data.map(event => ({
                    ...event,
                    start: new Date(event.startTime),
                    end: new Date(event.endTime)
                })));
            } else {
                throw new Error('Error al cargar los eventos');
            }
        } catch (error) {
            console.error('Error al obtener los eventos:', error);
        }
    };

    const fetchCommunityDetails = async () => {
        const userDataString = localStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        const communityId = userData.comunidad.id;

        try {
            const response = await fetch(`http://localhost:9000/api/comunidades/${communityId}`);
            if (response.ok) {
                const data = await response.json();
                setCommunityDetails(data);
            } else {
                throw new Error("Error al cargar los detalles de la comunidad");
            }
        } catch (error) {
            console.error('Error al obtener los detalles de la comunidad:', error);
        }
    };

    useEffect(() => {
        fetchCommunityDetails();

        if (instalaciones) {
            fetchEvents();
        } else if (location.state?.reserva) {
            fetchEvents();
            setInstalaciones(location.state.reserva);

        }
    }, [instalaciones, location]);

    const handleAddEvent = async () => {
        const event = {
            title,
            startTime: start,
            endTime: end,
            comunidad: userData.comunidad,
            instalaciones
        };

        try {
            const response = await fetch(`http://localhost:9000/api/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Error al crear el evento');
            }
            const newEvent = await response.json();
            setEvents([...events, { ...newEvent, start: new Date(newEvent.startTime), end: new Date(newEvent.endTime) }]);
            closeModal();
            alert('Evento creado exitosamente');
        } catch (error) {
            console.error('Error al crear un nuevo evento:', error);
            alert(error.message); // Muestra el mensaje de error desde el servidor
        }
        fetchEvents();
    };




    const handleDeleteEvent = async (reservationId) => {
        try {
            const response = await fetch(`http://localhost:9000/api/reservations/${reservationId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setEvents(events.filter(reservation => reservationId !== reservationId));
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
                {/* {president && (
                    <>
                        <Link to="/settings">
                            <img src={settingsButtonImg} alt="Settings" className="settings-button" />
                        </Link>
                        <span className="sidebar-label">Ajustes</span>
                    </>
                )} */}
            </aside>
            <main className="main-content">
                <header className="main-header">
                    <h1>Reservas</h1>
                    <h2 className='instalacion-h2'>{instalaciones ? installationNames[instalaciones] : 'Seleccione una instalación'}</h2>
                    <div className="header-buttons">
                        <button onClick={openModal} className="create-meeting-button">Reservar</button>
                        <button onClick={openDeleteModal} className="create-meeting-button">Eliminar Reserva</button>
                        <button onClick={logout} className="logout-button">Cerrar sesión</button>
                    </div>
                </header>
                <div className='reservations-container'>

                    <div className="calendar-container">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 500 }}
                            onSelectEvent={event => setSelectedEvent(event)}
                            views={['day', 'week', 'month']}
                            defaultView={Views.WEEK}
                            timeslots={1} // Asegura un slot por intervalo de tiempo
                            step={60} // Intervalo de tiempo de cada slot en minutos
                            eventPropGetter={eventStyleGetter}
                        />

                    </div>

                    <div className="reservations-details">
                        <h3 className="reservations-h2">Instalaciones de "{userData.comunidad.name}"</h3>
                        {communityDetails.cinema && (
                            <button className='buttonReservation' onClick={() => {
                                console.log('Instalación seleccionada:', 'cinema');
                                setInstalaciones('cinema');
                            }}>
                                Cine
                            </button>

                        )}
                        {communityDetails.gym && (
                            <button className='buttonReservation' onClick={() => setInstalaciones('gym')}>
                                Gimnasio
                            </button>
                        )}
                        {communityDetails.library && (
                            <button className='buttonReservation' onClick={() => setInstalaciones('library')}>
                                Biblioteca
                            </button>
                        )}

                        {communityDetails.pool && (
                            <button className='buttonReservation' onClick={() => setInstalaciones('pool')}>
                                Piscina
                            </button>
                        )}

                        {communityDetails.padel && (
                            <button className='buttonReservation' onClick={() => setInstalaciones('padel')}>
                                Pista de Pádel
                            </button>
                        )}

                    </div>
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
                    overlayClassName="ModalOverlay"
                >
                    <div className="create-reservation-wrapper">
                        <h2>Reserva</h2>
                        <form className="create-reservation-form">
                            <input type="text" placeholder="Nombre" value={title} onChange={e => setTitle(e.target.value)} />
                            <select value={instalaciones} onChange={e => setInstalaciones(e.target.value)}>
                                <option value="">Seleccione una instalación</option>
                                {communityDetails.cinema && <option value="cinema">Cine</option>}
                                {communityDetails.gym && <option value="gym">Gimnasio</option>}
                                {communityDetails.library && <option value="library">Biblioteca</option>}
                                {communityDetails.padel && <option value="padel">Pádel</option>}
                                {communityDetails.pool && <option value="pool">Piscina</option>}
                            </select>
                            <input type="datetime-local" value={moment(start).format('YYYY-MM-DDTHH:mm')} onChange={e => setStart(new Date(e.target.value))} />
                            <input type="datetime-local" value={moment(end).format('YYYY-MM-DDTHH:mm')} onChange={e => setEnd(new Date(e.target.value))} />
                        </form>
                        <div className='form-modal'>
                            <button type="button" className='button-modal' onClick={handleAddEvent}>Guardar Reserva</button>
                            <button type="button" className='button-modal' onClick={closeModal}>Cancelar</button>
                        </div>
                    </div>

                </Modal>



                <Modal
                    isOpen={deleteModalIsOpen}
                    onRequestClose={closeDeleteModal}
                    contentLabel="Eliminar Evento"
                    className="Modal"
                    overlayClassName="ModalOverlay"
                >
                    <div className="delete-reservation-wrapper">
                        <h2>Seleccione una reserva para eliminar</h2>
                        <div>
                            {events.map(event => (
                                <div key={event.id} className="event-list-item">
                                    <span>{event.title} - {moment(event.start).format('LLL')}</span>
                                    <button className="delete-button-modal" onClick={() => handleDeleteEvent(event.id)}>Eliminar</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" className="delete-button-modal" onClick={closeDeleteModal}>Cancelar</button>
                    </div>
                </Modal>

            </main>
        </div >
    );
}

export default Reservations;