import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function CrearArticulo() {
    const { token } = useAuth("state");
    const [titulo, setTitulo] = useState('');
    const [resumen, setResumen] = useState('');
    const [contenido, setContenido] = useState('');
    const [imagen, setImagen] = useState(null);
    const [epigrafe, setEpigrafe] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', titulo);
        formData.append('abstract', resumen);
        formData.append('content', contenido);
        if (imagen) formData.append('image', imagen);
        formData.append('caption', epigrafe);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}infosphere/articles/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to create article');
            }

            navigate('/articles');
        } catch (error) {
            setError('Error al crear el artículo');
        }
    };

    return (
        <div className="container">
            <h1 className="title has-text-centered">Crear Nuevo Artículo</h1>
            {error && <div className="notification is-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label className="label">Título</label>
                    <div className="control">
                        <input 
                            className="input" 
                            type="text" 
                            value={titulo} 
                            onChange={(e) => setTitulo(e.target.value)} 
                            required 
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Resumen</label>
                    <div className="control">
                        <input 
                            className="input" 
                            type="text" 
                            value={resumen} 
                            onChange={(e) => setResumen(e.target.value)} 
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Contenido</label>
                    <div className="control">
                        <textarea 
                            className="textarea" 
                            value={contenido} 
                            onChange={(e) => setContenido(e.target.value)} 
                            required
                        ></textarea>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Imagen</label>
                    <div className="control">
                        <input 
                            className="input" 
                            type="file" 
                            onChange={(e) => setImagen(e.target.files[0])} 
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Epígrafe de la imagen</label>
                    <div className="control">
                        <input 
                            className="input" 
                            type="text" 
                            value={epigrafe} 
                            onChange={(e) => setEpigrafe(e.target.value)} 
                        />
                    </div>
                </div>

                <div className="field has-text-centered">
                    <button className="button is-primary" type="submit">Crear Artículo</button>
                </div>
            </form>
        </div>
    );
}

export default CrearArticulo;
