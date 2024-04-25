import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateChats.css';

function CreateChat() {
    const navigate = useNavigate();
    const [chat, setChat] = useState({
        titulo: '',
        message: '',
        usuarios: [], // Inicializa un arreglo vacío para los usuarios
        chats: []    // Inicializa un arreglo vacío para los chats
    });

    const handleChange = (e) => {
        setChat({ ...chat, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userDataString = localStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        const communityId = userData.comunidad.id; // Asegúrate que userData tiene la propiedad 'comunidad'
        const sender = userData.name; // Asumimos que userData tiene un atributo 'name' para el remitente
        
        const newChat = { 
            ...chat, 
            comunidad: { id: communityId }, 
            fecha: new Date().toISOString(),
            sender: sender, // Añade el remitente al chat
            usuarios: chat.usuarios, // Podría incluir una lógica para añadir usuarios
            chats: chat.chats // Podría incluir una lógica para manejar mensajes de seguimiento
        };

        try {
            const response = await fetch('http://localhost:9000/api/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newChat)
            });
            if (response.ok) {
                alert('Chat creado con éxito');
                navigate('/chats'); // Redirige al usuario a la página de chats
            } else {
                const errorData = await response.json();
                throw new Error('Error al crear chat: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error al crear el chat:', error);
            alert('Error al crear el chat: ' + error.message);
        }
    };

    return (
        <div className="create-election-background">
            <div className="create-election-wrapper">
                <h2>Crear nuevo chat</h2>
                <form onSubmit={handleSubmit} className="create-election-form">
                    <input
                        type="text"
                        name="titulo"
                        value={chat.titulo}
                        onChange={handleChange}
                        placeholder="Título del chat"
                        required
                    />
                    <textarea
                        name="message"
                        value={chat.message}
                        onChange={handleChange}
                        className="create-election-textarea"
                        placeholder="Mensaje inicial"
                        required
                    ></textarea>
                    {/* Aquí podrías añadir inputs para manejar los usuarios y los mensajes de chat si es necesario */}
                    <div className="form-actions">
                        <button type="submit" className="create-election-button">Crear Chat</button>
                        <button type="button" className="cancel-button" onClick={() => navigate('/chats')}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateChat;