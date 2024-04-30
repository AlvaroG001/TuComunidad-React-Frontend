import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateMeetings.css';

function CreateMeetings() {
    const navigate = useNavigate();
    const [meeting, setMeeting] = useState({
        titulo: '',
        day: '',
        hour: '',
        month: '',
        year: '',
        information: ''
    });

    const handleChange = (e) => {
        setMeeting({ ...meeting, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userDataString = localStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        const communityId = userData.comunidad.id; // Asumiendo que la propiedad se llama comunidad y está almacenada así en userData

        const newMeeting = {
            ...meeting,
            comunidad: { id: communityId }  // Ajuste para estructurar correctamente según el modelo del backend
        };

        try {
            const response = await fetch('http://localhost:9000/api/reuniones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMeeting)
            });
            if (response.ok) {
                alert('Reunión creada con éxito');
                navigate('/meetings'); // Redirige al usuario a la página de reuniones
            } else {
                throw new Error(await response.text());
            }
        } catch (error) {
            console.error('Error al crear la reunión:', error);
            alert('Error al crear la reunión: ' + error.message);
        }
    };

    return (
        <div className="create-meeting-background">
            <div className="create-meeting-wrapper">
                <h2>Crear nueva reunión</h2>
                <form onSubmit={handleSubmit} className="create-meeting-form">
                    <input type="text" name="titulo" value={meeting.titulo} onChange={handleChange} placeholder="Título" required />
                    <input type="text" name="day" value={meeting.day} onChange={handleChange} placeholder="Día" required />
                    <input type="text" name="hour" value={meeting.hour} onChange={handleChange} placeholder="Hora" required />
                    <input type="text" name="month" value={meeting.month} onChange={handleChange} placeholder="Mes" required />
                    <input type="text" name="year" value={meeting.year} onChange={handleChange} placeholder="Año" required />
                    <textarea
                        name="information"
                        value={meeting.information}
                        onChange={handleChange}
                        className="create-meeting-textarea"
                        placeholder="Información de la reunión"
                        required
                    ></textarea>
                    <div className="form-actions">
                        <button type="submit" className="create-meeting-button">Crear reunión</button>
                        <button type="button" onClick={() => navigate('/meetings')} className="cancel-button">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateMeetings;
