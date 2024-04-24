import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateChats.css'; // Asegúrate de importar el CSS

function CreateChats() {
    const navigate = useNavigate();
    const [chat, setChat] = useState({
        sender: '',
        message: ''
    });

    /**
     * Maneja los cambios en los campos de entrada del formulario.
     * 
     * @param {Event} e - Evento de cambio.
     */
    const handleChange = (e) => {
        setChat({ ...chat, [e.target.name]: e.target.value });
    };

    /**
     * Maneja el envío del formulario de creación de chats.
     * 
     * @param {Event} e - Evento de envío de formulario.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userDataString = localStorage.getItem('userData');
        const userData = JSON.parse(userDataString);

        // Asegurarse de que userData y userData.comunidad están definidos
        if (!userData || !userData.comunidad) {
            console.error('No se encontró la información de la comunidad del usuario');
            return;  // Salir de la función si no se encuentran los datos necesarios
        }

        const communityId = userData.comunidad.id;

        // Crear el objeto del nuevo chat incluyendo el community_id
        const newChat = { ...chat, community_id: communityId };

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
                throw new Error('Failed to create chat');
            }
        } catch (error) {
            console.error('Error al crear el chat:', error);
            alert('Error al crear el chat: ' + error.message);
        }
    };


    return (
        <div className="create-meeting-background">
            <div className="create-meeting-wrapper">
                <h2>Crear nuevo chat</h2>
                <form onSubmit={handleSubmit} className="create-meeting-form">
                    <input
                        type="text"
                        name="sender"
                        value={chat.sender}
                        onChange={handleChange}
                        placeholder="Remitente"
                        required
                    />
                    <textarea
                        name="message"
                        value={chat.message}
                        onChange={handleChange}
                        className="create-meeting-textarea"
                        placeholder="Mensaje"
                        required
                    ></textarea>
                    <div className="form-actions">
                        <button type="submit" className="create-meeting-button">Enviar Mensaje</button>
                        <button type="button" className="cancel-button" onClick={() => navigate('/chats')}>Volver</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateChats;
