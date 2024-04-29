import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';

import perfilImg from '../Logos/Perfil.png';
import homeButtonImg from '../Logos/HomeButton.png';
import calendarButtonImg from '../Logos/CalendarButton.png';
import meetingButtonImg from '../Logos/MeetingButton.png';
import voteButtonImg from '../Logos/VoteButton.png';
import chatButtonImg from '../Logos/ChatButton.png';
import settingsButtonImg from '../Logos/SettingsButton.png';


function Home({ logout }) {
  const navigate = useNavigate();
  const [communityName, setCommunityName] = useState('Tu Comunidad');
  const [president, setPresident] = useState(false);

  const [meetings, setMeetings] = useState([]);

  const [chats, setChats] = useState([]);

  const [elections, setElections] = useState([]);

  const [communityDetails, setCommunityDetails] = useState({});



  const fetchCommunityName = async () => {
    try {
      const userDataString = localStorage.getItem('userData');
      const userData = JSON.parse(userDataString);
      if (userData && userData.comunidad && userData.comunidad.name) {
        setCommunityName(userData.comunidad.name);
      } else {
        throw new Error('El nombre de la comunidad no está disponible.');
      }
      if (userData && userData.president !== undefined) {
        setPresident(userData.president);
      } else {
        throw new Error('El estado de presidente no está disponible.');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
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

        const sortedData = data.sort((a, b) => b.id - a.id);
        setMeetings(sortedData.slice(0, 4));

      } else {
        throw new Error("Error al cargar las reuniones");
      }
    } catch (error) {
      console.error('Error al obtener las reuniones:', error);
    }
  };

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

        const sortedData = data.sort((a, b) => b.id - a.id);
        setElections(sortedData.slice(0, 4));

      } else {
        throw new Error("Error al cargar las votaciones");
      }
    } catch (error) {
      console.error('Error al obtener las votaciones:', error);
    }
  };

  const fetchChats = async () => {
    const userDataString1 = localStorage.getItem('userData');
    const userData1 = JSON.parse(userDataString1);
    const communityId = userData1.comunidad.id;

    setPresident(userData1?.president);

    try {
      const response = await fetch(`http://localhost:9000/api/chats?communityId=${communityId}`);
      if (response.ok) {
        const data = await response.json();
        // setChats(data);
        // Asegúrate de que los datos se ordenen de más reciente (id más alto) a más antiguo antes de hacer el slice
        const sortedData = data.sort((a, b) => b.id - a.id);
        setChats(sortedData.slice(0, 4)); // Guarda las últimas 5 votaciones (las más recientes)
        // setSelectedChat(sortedData[0]); // Selecciona la votación más reciente como la votación seleccionada por defecto

      } else {
        throw new Error('Error al cargar los chats');
      }
    } catch (error) {
      console.error('Error al obtener los chat:', error);
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
    fetchCommunityName();
    fetchMeetings();
    fetchElections();
    fetchChats();
    fetchCommunityDetails();

  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMeetingClick = (meeting) => {
    navigate('/meetings', { state: { meeting: meeting } });
  };

  const handleElectionClick = (election) => {
    navigate('/votes', { state: { election: election } });
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

        {/* Iconos y enlaces de la barra lateral */}
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Bienvenido a "{communityName}"</h1>
          <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>
        </header>

        <div className='media-container'>

          <div className='meetingsAndElections'>
            <div className='meetings'>
              <h2>REUNIONES</h2>
              <div className='buttons-container'>
                {meetings.map(meeting => (
                  <button className='buttonMeeting' key={meeting.id} onClick={() => handleMeetingClick(meeting)}>
                    El {meeting.day} de {meeting.month} del {meeting.year}
                  </button>
                ))}
              </div>
            </div>
            <div className='elections'>
              <h2>VOTACIONES</h2>
              <div className='buttons-container'>
                {elections.map((election, index) => (
                  <button className='buttonElection' key={election.id} onClick={() => handleElectionClick(election)}>
                    {election.titulo}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className='chatsAndReservations'>
            <div className='chats'>
              <h2>CHATS</h2>
              <div className='buttons-container'>
                {chats.map((chat, index) => (
                  <button className='buttonChat' key={chat.id} onClick={() => navigate('/chats')}>
                    <img src={perfilImg} alt="Perfil" className="perfil-user" />
                    <h3>{chat.usuarios[index]}</h3>
                    <p>{chat.titulo}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className='reservations'>
              <h2>INSTALACIONES</h2>
              <div className='buttons-container'>
                {communityDetails.cinema &&
                  <button className='buttonReservation' onClick={() => navigate('/reservations')}>
                    Cine
                  </button>
                }
                {communityDetails.gym &&
                  <button className='buttonReservation' onClick={() => navigate('/reservations')}>
                    Gimnasio
                  </button>
                }
                {communityDetails.library &&
                  <button className='buttonReservation' onClick={() => navigate('/reservations')}>
                    Biblioteca
                  </button>
                }
                {communityDetails.padel &&
                  <button className='buttonReservation' onClick={() => navigate('/reservations')}>
                    Pádel
                  </button>
                }
                {communityDetails.pool &&
                  <button className='buttonReservation' onClick={() => navigate('/reservations')}>
                    Piscina
                  </button>
                }
              </div>
            </div>
          </div>

        </div>

      </main >
    </div >
  );
}

export default Home;
