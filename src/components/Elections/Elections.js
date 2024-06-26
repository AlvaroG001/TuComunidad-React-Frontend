import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Elections.css';

import homeButtonImg from '../Logos/HomeButton.png';
import calendarButtonImg from '../Logos/CalendarButton.png';
import meetingButtonImg from '../Logos/MeetingButton.png';
import voteButtonImg from '../Logos/VoteButton.png';
import chatButtonImg from '../Logos/ChatButton.png';
import settingsButtonImg from '../Logos/SettingsButton.png';

function Elections({ logout }) {
    const location = useLocation();
    const [president, setPresident] = useState(false);
    const [elections, setElections] = useState([]);
    const [selectedElection, setSelectedElection] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [admin, setAdmin] = useState(false);

    const [agreeCount, setAgreeCount] = useState();
    const [disagreeCount, setDisagreeCount] = useState();
    const [abstainCount, setAbstainCount] = useState();

    const userDataString = localStorage.getItem('userData');
    const userData = JSON.parse(userDataString);

    const fetchElections = async () => {
        const userDataString1 = localStorage.getItem('userData');
        const userData1 = JSON.parse(userDataString1);
        const communityId1 = userData1.comunidad.id; // Asegúrate de que el objeto y la propiedad sean correctos

        setPresident(userData1?.president);
        setAdmin(userData1?.admin);

        try {
            const response = await fetch(`http://localhost:9000/api/votaciones?communityId=${communityId1}`);
            if (response.ok) {
                const data = await response.json();

                const sortedData = data.sort((a, b) => b.id - a.id);
                setElections(sortedData.slice(0, 5));

            } else {
                throw new Error("Error al cargar las votaciones");
            }
        } catch (error) {
            console.error('Error al obtener las votaciones:', error);
        }

    };

    const selectElection = useCallback((election) => {
        console.log(election);
        setSelectedElection(election);
        checkIfUserHasVoted(election?.votantes);
        setAgreeCount(election?.respuestas.filter(respuesta => respuesta === '1').length);
        setDisagreeCount(election?.respuestas.filter(respuesta => respuesta === '2').length);
        setAbstainCount(election?.respuestas.filter(respuesta => respuesta === '3').length);
    }, []);


    useEffect(() => {
        fetchElections();
        if (location.state?.election) {
            selectElection(location.state.election);
            setSelectedElection(location.state.election);
        }
    }, [location, selectElection]);


    const checkIfUserHasVoted = async (electionVotantes) => {
        const userDataString = localStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        const userId = userData.id;

        const userHasVoted = electionVotantes?.includes(userId);

        setHasVoted(userHasVoted);
    };

    const handleVote = async (voteType) => {
        const userId = userData.id;

        const voteOptions = {
            'agree': 1,
            'disagree': 2,
            'abstain': 3
        };
        const voteOption = voteOptions[voteType];
        // Crear una copia de la elección actual para modificarla
        let updatedElection = { ...selectedElection };
        updatedElection.votantes = [...updatedElection.votantes, userId];  // Añadir el ID del usuario al array de votantes
        updatedElection.respuestas = [...updatedElection.respuestas, voteOption];  // Añadir la opción de voto al array de respuestas

        // Actualizar los contadores localmente antes de enviar la solicitud
        const updatedAgreeCount = agreeCount + (voteType === 'agree' ? 1 : 0);
        const updatedDisagreeCount = disagreeCount + (voteType === 'disagree' ? 1 : 0);
        const updatedAbstainCount = abstainCount + (voteType === 'abstain' ? 1 : 0);

        setAgreeCount(updatedAgreeCount);
        setDisagreeCount(updatedDisagreeCount);
        setAbstainCount(updatedAbstainCount);

        try {
            const response = await fetch(`http://localhost:9000/api/votaciones/${selectedElection.id}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedElection)  // Enviar la elección actualizada
            });
            if (response.ok) {
                setHasVoted(true);
                alert('Tu voto ha sido registrado.');
                setSelectedElection(updatedElection);  // Actualizar la elección en el estado

            } else {
                throw new Error('Failed to record the vote');
            }
        } catch (error) {
            console.error('Error submitting vote:', error);
        }

        fetchElections();
    };


    const deleteElection = async (electionId) => {
        try {
            const response = await fetch(`http://localhost:9000/api/votaciones/${electionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                alert('Votación eliminada con éxito');
                setElections(elections.filter(e => e.id !== electionId)); // Actualizar la lista de votaciones
                if (selectedElection.id === electionId) {
                    setSelectedElection(null); // Quitar la selección si la votación eliminada estaba seleccionada
                }
            } else {
                throw new Error('Failed to delete election');
            }
        } catch (error) {
            console.error('Error al eliminar la votación:', error);
            alert('Error al eliminar la votación: ' + error.message);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString("es-ES", options);
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
                <header className="main-header">
                    <h1>Votaciones pedientes - {userData.comunidad.name}</h1>
                    <div className="header-buttons">
                        {president && (
                            <Link to="/create-elections" className="create-meeting-button">
                                Crear Votación
                            </Link>
                        )}
                        <button onClick={logout} className="logout-button">Cerrar sesión</button>
                    </div>
                </header>

                <div className="elections-container">

                    {selectedElection && (
                        <div className="elections-details">
                            <h2 className="vote-title" >{selectedElection.titulo}</h2>
                            <p className="election-info">{selectedElection.informacion}</p>
                            <h4 className="election-info">Cierre de la votación: </h4>
                            <p className="election-info">{formatDate(selectedElection.fecha)}</p>
                            {!hasVoted ? (
                                <div className="vote-container">
                                    <button className="vote-button-election" onClick={() => handleVote('agree')}>Estoy de acuerdo</button>
                                    <button className="vote-button-election" onClick={() => handleVote('disagree')}>No estoy de acuerdo</button>
                                    <button className="vote-button-election" onClick={() => handleVote('abstain')}>Me abstengo</button>
                                </div>
                            ) : (
                                <h3 className='thanks'>Gracias por su voto!</h3>
                            )}
                            {president && (
                                <button className="delete-election-button" onClick={() => deleteElection(selectedElection.id)}>Eliminar Votación</button>
                            )}

                            {president && (
                                <div className="voting-results">
                                    <h3>Resultados de la Votación</h3>
                                    <p>Estoy de acuerdo  =  {agreeCount}</p>
                                    <p>No estoy de acuerdo  =  {disagreeCount}</p>
                                    <p>Me abstengo  =  {abstainCount}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="elections-list">
                        <h2>Votaciones pedientes</h2>
                        {elections.map(election => (
                            <button className="ListMeeting-button" key={election.id} onClick={() => selectElection(election)}>
                                {election.titulo}
                            </button>
                        ))}
                    </div>

                </div>

            </main>
        </div>
    );
}

export default Elections;