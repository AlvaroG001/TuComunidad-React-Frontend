import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Elections.css';

import homeButtonImg from '../Logos/HomeButton.png';
import calendarButtonImg from '../Logos/CalendarButton.png';
import meetingButtonImg from '../Logos/MeetingButton.png';
import voteButtonImg from '../Logos/VoteButton.png';
import chatButtonImg from '../Logos/ChatButton.png';
import settingsButtonImg from '../Logos/SettingsButton.png';

function Elections({ logout }) {
    const [president, setPresident] = useState(false);
    const [elections, setElections] = useState([]);
    const [selectedElection, setSelectedElection] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);


    const fetchElections = async () => {
        const userDataString = localStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        const communityId = userData.comunidad.id; // Asegúrate de que el objeto y la propiedad sean correctos
        
        setPresident(userData?.president);
    
        try {
            const response = await fetch(`http://localhost:9000/api/votaciones?communityId=${communityId}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setElections(data.slice(-5)); // Guarda las últimas 5 votaciones
            } else {
                throw new Error("Error al cargar las votaciones");
            }
        } catch (error) {
            console.error('Error al obtener las votaciones:', error);
        }
    };

    useEffect(() => {

        fetchElections();

    }, []);

    const checkIfUserHasVoted = async (electionVotantes) => {
        const userDataString = localStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        const userId = userData.id;

        // Comprueba si el userId está en el array de votantes
        const userHasVoted = electionVotantes.includes(userId);

        // Actualiza el estado basado en si el usuario ha votado o no
        setHasVoted(userHasVoted);
    };

    const handleVote = async (voteType) => {
        const userDataString = localStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        const userId = userData.id;
        console.log(userId);

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
                alert('Your vote has been recorded.');
                setSelectedElection(updatedElection);  // Actualizar la elección en el estado
            } else {
                throw new Error('Failed to record the vote');
            }
        } catch (error) {
            console.error('Error submitting vote:', error);
        }

        fetchElections();
    };



    const selectElection = (election) => {
        setSelectedElection(election);
        checkIfUserHasVoted(election.votantes);
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
                <h1>Votaciones de la Comunidad</h1>
                <div className="header-buttons"> 
                <Link to="/create-elections" className="create-elections-button">
                    Crear Votación
                </Link>
                
                   <button onClick={logout} className="logout-button">Cerrar sesión</button>
                </div>
            </header>
            <div className="election-details">
                {selectedElection && (
                    <>
                        <h2>{selectedElection.titulo}</h2>
                        <p>{selectedElection.informacion}</p>
                        <p>{selectedElection.fecha}</p>
                        {!hasVoted ? (
                            <div>
                                <button onClick={() => handleVote('agree')}>Estoy de acuerdo</button>
                                <button onClick={() => handleVote('disagree')}>No estoy de acuerdo</button>
                                <button onClick={() => handleVote('abstain')}>Me abstengo</button>
                            </div>
                        ) : (
                            <p>Thanks for voting!</p>
                        )}
                        {president && (
                            <button onClick={() => deleteElection(selectedElection.id)}>Eliminar Votación</button>
                        )}
                    </>
                )}
            </div>

            <div className="elections-list">
                <h2>Previous Elections</h2>
                {elections.map(election => (
                    <button key={election.id} onClick={() => selectElection(election)}>
                        {election.titulo} - {election.fecha}
                    </button>
                ))}
            </div>
        </main>
    </div>
);
}

export default Elections;