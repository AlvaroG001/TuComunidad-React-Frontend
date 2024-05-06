import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css'; // Asegúrate de importar el CSS para este componente

function Admin() {
    const navigate = useNavigate();
    const [comunidad, setComunidad] = useState({
        name: '',
        cinema: false,
        gym: false,
        library: false,
        padel: false,
        pool: false
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setComunidad({ ...comunidad, [e.target.name]: value });
    };

    const fetchLastCommunityId = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/comunidades');
            if (response.ok) {
                const comunidades = await response.json();
                const lastCommunity = comunidades[comunidades.length - 1]; // Obtiene la última comunidad
                alert(`Comunidad creada con éxito. ID: ${lastCommunity.id}`);
                navigate('/home'); // Redirige al usuario a la página de inicio
            } else {
                throw new Error('Failed to fetch communities');
            }
        } catch (error) {
            console.error('Error al obtener el ID de la comunidad:', error);
            alert('Error al obtener el ID de la comunidad: ' + error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:9000/api/comunidades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidad)
            });
            if (response.ok) {
                fetchLastCommunityId(); // Llama a esta función después de crear la comunidad
            } else {
                throw new Error('Failed to create community');
            }
        } catch (error) {
            console.error('Error al crear la comunidad:', error);
            alert('Error al crear la comunidad: ' + error.message);
        }
    };

    return (
        <div className="home-container">
            <div className="create-election-background">
                <div className="create-election-wrapper">
                    <h2>Crear nueva comunidad</h2>
                    <form onSubmit={handleSubmit} className="create-election-form">
                        <input
                            type="text"
                            name="name"
                            value={comunidad.name}
                            onChange={handleChange}
                            placeholder="Nombre de la comunidad"
                            required
                        />
                        <div className="facilities-container">
                            <label className="facility-checkbox">
                                <span className="facility-name">Cine:</span>
                                <input
                                    type="checkbox"
                                    name="cinema"
                                    checked={comunidad.cinema}
                                    onChange={handleChange}
                                />
                                <span className="checkmark"></span>
                            </label>
                            <label className="facility-checkbox">
                                <span className="facility-name">Gimnasio:</span>
                                <input
                                    type="checkbox"
                                    name="gym"
                                    checked={comunidad.gym}
                                    onChange={handleChange}
                                />
                                <span className="checkmark"></span>
                            </label>
                            <label className="facility-checkbox">
                                <span className="facility-name">Biblioteca:</span>
                                <input
                                    type="checkbox"
                                    name="library"
                                    checked={comunidad.library}
                                    onChange={handleChange}
                                />
                                <span className="checkmark"></span>
                            </label>
                            <label className="facility-checkbox">
                                <span className="facility-name">Pádel:</span>
                                <input
                                    type="checkbox"
                                    name="padel"
                                    checked={comunidad.padel}
                                    onChange={handleChange}
                                />
                                <span className="checkmark"></span>
                            </label>
                            <label className="facility-checkbox">
                                <span className="facility-name">Piscina:</span>
                                <input
                                    type="checkbox"
                                    name="pool"
                                    checked={comunidad.pool}
                                    onChange={handleChange}
                                />
                                <span className="checkmark"></span>
                            </label>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="create-community-button">Crear Comunidad</button>
                            <button type="button" className="cancel-button" onClick={() => navigate('/home')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Admin;
