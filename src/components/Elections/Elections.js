import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Elections.css';

import homeButtonImg from '../Logos/HomeButton.png';
import calendarButtonImg from '../Logos/CalendarButton.png';
import meetingButtonImg from '../Logos/MeetingButton.png';
import voteButtonImg from '../Logos/VoteButton.png';
import chatButtonImg from '../Logos/ChatButton.png';
import settingsButtonImg from '../Logos/SettingsButton.png';

function Elections({ logout }) {
    const navigate = useNavigate();
    const [isPresident, setIsPresident] = useState(false);
    const [elections, setElections] = useState([]);
    const [selectedElection, setSelectedElection] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);  // Agregar estado para manejar si el usuario ha votado

    useEffect(() => {
        const fetchElections = async () => {
            const userDataString = localStorage.getItem('userData');
            const userData = JSON.parse(userDataString);
            setIsPresident(userData?.isPresident);

            try {
                const response = await fetch('http://localhost:9000/api/votaciones');
                const data = await response.json();
                setElections(data);
                setSelectedElection(data[0]); 
                checkIfUserHasVoted(data[0]._id);
            } catch (error) {
                console.error('Error fetching elections:', error);
            }
        };

        fetchElections();
    }, []);

    // Función para verificar si el usuario ha votado
    const checkIfUserHasVoted = async (electionId) => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`http://localhost:9000/api/votaciones/check/${userId}/${electionId}`);
            const { hasVoted } = await response.json();
            setHasVoted(hasVoted);
        } catch (error) {
            console.error('Error checking vote status:', error);
        }
    };

    // Función para manejar la votación
    const handleVote = async (voteType) => {
        const userId = localStorage.getItem('userId');
        try {
            await fetch('http://localhost:9000/api/votaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ electionId: selectedElection._id, userId, voteType })
            });
            setHasVoted(true);
            alert('Your vote has been recorded.');
        } catch (error) {
            console.error('Error submitting vote:', error);
        }
    };

    const selectElection = (election) => {
        setSelectedElection(election);
        checkIfUserHasVoted(election._id);
    };
// {isPresident && ( )} poner esto en el boton crear una votacion
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
                <h1>Votaciones de la Comunidad</h1>
                <div className="header-buttons"> 
                <Link to="/create-elections" className="create-elections-button">
                    Crear Votación
                </Link>
                
                   <button onClick={logout} className="logout-button">Cerrar sesión</button>
                </div>
            </header>
            {selectedElection && (
                    <div className="election-details">
                        <h2>{selectedElection.title}</h2>
                        <p>{selectedElection.description}</p>
                        {!hasVoted && (
                            <div>
                                <button onClick={() => handleVote('agree')}>Estoy de acuerdo</button>
                                <button onClick={() => handleVote('disagree')}>No estoy de acuerdo</button>
                                <button onClick={() => handleVote('abstain')}>Me abstengo</button>
                            </div>
                        )}
                    </div>
                )}
                <div className="elections-list">
                    <h2>Previous Elections</h2>
                    {elections.slice(0, 4).map(election => (
                        <button key={election.id} onClick={() => selectElection(election)}>
                            {election.title} - {new Date(election.date).toLocaleDateString()}
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Elections;