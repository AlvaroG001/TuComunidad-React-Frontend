import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateMeetings.css'; // Asegúrate de importar el CSS

/**
 * Componente CreateMeetings.
 * 
 * @returns {JSX.Element} Componente para crear nuevas reuniones.
 */
function CreateMeetings() {
    const navigate = useNavigate();
    const [isTextareaFocused, setIsTextareaFocused] = useState(false);
    const [meeting, setMeeting] = useState({
        day: '',
        hour: '',
        month: '',
        year: '',
        information: ''
    });

    /**
     * Maneja el cambio en los campos del formulario.
     * 
     * @param {Event} e - Evento de cambio.
     */
    const handleChange = (e) => {
        setMeeting({ ...meeting, [e.target.name]: e.target.value });
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

        const newMeeting = { ...meeting, comunity_id: comunityId };

        try {
            await fetch('http://localhost:9000/api/reuniones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMeeting)
            });
            alert('Reunión creada con éxito');
            navigate('/meetings'); // Redirige al usuario a la página de reuniones
        } catch (error) {
            console.error('Error al crear la reunión:', error);
        }
    };

    return (
        <div className="create-meeting-background"> {/* Cambiado de create-meeting-container a create-meeting-background */}
            <div className="create-meeting-wrapper">
                <h2>Crear nueva reunión</h2>
                <form onSubmit={handleSubmit} className="create-meeting-form">
                    <input type="text" name="day" value={meeting.day} onChange={handleChange} placeholder="Día" required />
                    <input type="text" name="hour" value={meeting.hour} onChange={handleChange} placeholder="Hora" required />
                    <input type="text" name="month" value={meeting.month} onChange={handleChange} placeholder="Mes" required />
                    <input type="text" name="year" value={meeting.year} onChange={handleChange} placeholder="Año" required />
                    <textarea
                        name="information"
                        value={meeting.information}
                        onChange={handleChange}
                        onFocus={() => setIsTextareaFocused(true)}
                        onBlur={() => setIsTextareaFocused(false)}
                        className={`create-meeting-textarea ${isTextareaFocused ? 'textarea-focused' : ''}`}
                        placeholder="Información de la reunión"
                        required
                    ></textarea>
                    <div className="form-actions">
                        <button type="submit" className="create-meeting-button">Crear reunión</button>
                        <button type="button" className="cancel-button" onClick={() => navigate('/meetings')}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateMeetings;
