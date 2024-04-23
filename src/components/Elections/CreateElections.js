import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateElections.css'; // Asegúrate de importar el CSS

function CreateElections() {
    const navigate = useNavigate();
    const [election, setElection] = useState({
        titulo: '',
        informacion: '',
        fecha: ''
    });

    const handleChange = (e) => {
        setElection({ ...election, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userDataString = localStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        const communityId = userData.comunidad.id; // Asumimos que userData tiene la propiedad 'comunidad'

        const newElection = { ...election, comunidad: { id: communityId } };

        try {
            const response = await fetch('http://localhost:9000/api/votaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newElection)
            });
            if (response.ok) {
                alert('Votación creada con éxito');
                navigate('/votes'); // Redirige al usuario a la página de votaciones
            } else {
                throw new Error('Failed to create election');
            }
        } catch (error) {
            console.error('Error al crear la votación:', error);
            alert('Error al crear la votación: ' + error.message);
        }
    };

    return (
        <div className="create-election-background">
            <div className="create-election-wrapper">
                <h2>Crear nueva votación</h2>
                <form onSubmit={handleSubmit} className="create-election-form">
                    <input
                        type="text"
                        name="titulo"
                        value={election.titulo}
                        onChange={handleChange}
                        placeholder="Título de la votación"
                        required
                    />
                    <textarea
                        name="informacion"
                        value={election.informacion}
                        onChange={handleChange}
                        className="create-election-textarea"
                        placeholder="Descripción de la votación"
                        required
                    ></textarea>
                    <input
                        type="date"
                        name="fecha"
                        value={election.fecha}
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
