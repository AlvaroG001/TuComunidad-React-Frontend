import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateChats.css'; // Asegúrate de importar el CSS

function CreateChats() {
    const navigate = useNavigate();
    const [isTextareaFocused, setIsTextareaFocused] = useState(false);
    const [chat, setChat] = useState({
        day: '',
        hour: '',
        month: '',
        year: '',
        information: ''
    });

    const handleChange = (e) => {
        setChat({ ...chat, [e.target.name]: e.target.value });
    };

    /**
     * Maneja el envío del formulario de creación de reuniones.
     * 
     * @param {Event} e - Evento de envío de formulario.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userDataString = localStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        const comunityId = userData.comunity_id;

        const newMeeting = { ...chat, comunity_id: comunityId };
    };



    return (
        <div className="create-meeting-background"> {/* Cambiado de create-meeting-container a create-meeting-background */}
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
                        type="text"
                        name="message"
                        value={chat.message}
                        onChange={handleChange}
                        onFocus={() => setIsTextareaFocused(true)}
                        onBlur={() => setIsTextareaFocused(false)}
                        className={`create-meeting-textarea ${isTextareaFocused ? 'textarea-focused' : ''}`}
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
    )
}
export default CreateChats;