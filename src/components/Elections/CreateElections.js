import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateElections.css'; // Asegúrate de importar el CSS

function CreateElections() {
    const navigate = useNavigate();
    const [election, setElection] = useState({
        title: '',
        description: '',
        date: ''
    });

    const handleChange = (e) => {
        setElection({ ...election, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userDataString = localStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        const comunityId = userData.comunity_id; // Asume que esto es parte del modelo de datos

        const newElection = { ...election, comunity_id: comunityId  };

        try {
            await fetch('http://localhost:9000/api/votaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newElection)
            });
            alert('Votación creada con éxito');
            navigate('/votes'); // Redirige al usuario a la página de votaciones
        } catch (error) {
            console.error('Error al crear la votación:', error);
        }
    };

    return (
        <div className="create-election-background">
            <div className="create-election-wrapper">
                <h2>Crear nueva votación</h2>
                <form onSubmit={handleSubmit} className="create-election-form">
                    <input
                        type="text"
                        name="title"
                        value={election.title}
                        onChange={handleChange}
                        placeholder="Título de la votación"
                        required
                    />
                    <textarea
                        name="description"
                        value={election.description}
                        onChange={handleChange}
                        className="create-election-textarea"
                        placeholder="Descripción de la votación"
                        required
                    ></textarea>
                    <input
                        type="date"
                        name="date"
                        value={election.date}
                        onChange={handleChange}
                        required
                    />
                    <div className="form-actions">
                        <button type="submit" className="create-election-button">Crear Votación</button>
                        <button type="button" className="cancel-button" onClick={() => navigate('/votes')}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateElections;
