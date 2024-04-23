import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import Home from './components/Home/Home';
import Meetings from './components/Meetings/Meetings';
import CreateMeetings from './components/Meetings/CreateMeetings'
import Chats from './components/Chats/Chats'
import CreateChats from './components/Chats/CreateChats'
import Elections from './components/Elections/Elections'
import CreateElections from './components/Elections/CreateElections'
import Reservations from './components/Reservations/Reservations';

function App() {
  const [isAuthenticated, setIsAuthenticatedState] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const setIsAuthenticated = (value) => {
    localStorage.setItem("isAuthenticated", value);
    setIsAuthenticatedState(value);
  };

  const logout = () => {
    setIsAuthenticated(false); // Actualiza el estado y el localStorage
  };

  useEffect(() => {
    const authState = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticatedState(authState);
  }, []);

  //console.log(isAuthenticated);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginForm setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/home" />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/home" element={isAuthenticated ? <Home logout={logout} /> : <Navigate to="/login" />} />
        
        <Route path="/meetings" element={isAuthenticated ? <Meetings logout={logout} /> : <Navigate to="/login" />} />
        <Route path="/create-meetings" element={isAuthenticated ? <CreateMeetings logout={logout} /> : <Navigate to="/login" />} />

        <Route path="/reservations" element={isAuthenticated ? <Reservations logout={logout} /> : <Navigate to="/login" />} />
        

        <Route path="/chats" element={isAuthenticated ? <Chats logout={logout} /> : <Navigate to="/login" />} />
        <Route path="/create-chats" element={isAuthenticated ? <CreateChats logout={logout} /> : <Navigate to="/login" />} />

        <Route path="/votes" element={isAuthenticated ? <Elections logout={logout} /> : <Navigate to="/login" />} />
        <Route path="/create-elections" element={isAuthenticated ? <CreateElections logout={logout} /> : <Navigate to="/login" />} />

        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

function NoMatch() {
  return <div>Página no encontrada. <a href="/login">Volver al inicio</a></div>;
}
