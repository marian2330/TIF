import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import Carga from '../Carga'; // Asegúrate de que la ruta sea correcta

function DeleteArticle() {
    const { isAuthenticated, token } = useAuth("state");
    const navigate = useNavigate();
    const [articulos, setArticulos] = useState([]);
    const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Agrega un estado para cargar
    const [isError, setIsError] = useState(false); // Agrega un estado para error

    useEffect(() => {
        if (!isAuthenticated || !token) {
            navigate('/login'); // Redirige al login si no hay autenticación o token
        }
    }, [isAuthenticated, token, navigate]);
    // Hook para obtener el perfil del usuario
    const {
        data: userData,
        isLoading: isLoadingProfile,
        isError: isErrorProfile,
        doFetch: fetchProfile,
    } = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}users/profiles/profile_data/`,
        {
            method: "GET",
            headers: {
                Authorization: `Token ${token}`,
            },
        }
    );
    
    useEffect(() => {
        if (isAuthenticated) {
            fetchProfile();
        }
    }, [isAuthenticated, token]);

    useEffect(() => {
        const fetchArticulos = async () => {
            let allArticles = [];
            let url = `${import.meta.env.VITE_API_BASE_URL}infosphere/articles/`;
            
            while (url) {
                try {
                    const response = await fetch(url, {
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        // Filtra por usuario
                        const userArticles = data.results.filter(article => article.author === userData.user__id);
                        allArticles = [...allArticles, ...userArticles];
                        // Verifica si hay más páginas
                        url = data.next; // URL de la siguiente página
                    } else {
                        throw new Error('Error al obtener los artículos');
                    }
                } catch (error) {
                    console.error('Error al obtener los artículos:', error);
                    setIsError(true);
                    break;
                }
            }
        
            setArticulos(allArticles);
            setIsLoading(false); // Termina la carga cuando se obtienen los datos
        };
    
        if (userData && userData.user__id) {
            fetchArticulos();
        }
    }, [userData, token]);

    const handleEliminar = async (id) => {
        const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar el artículo "${articuloSeleccionado.title}"?`);

        if (!confirmacion) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}infosphere/articles/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            if (response.status === 204) {
                alert('Artículo eliminado exitosamente.');
                setArticulos(articulos.filter(articulo => articulo.id !== id));
                setArticuloSeleccionado(null);
                navigate('/articles');
            } else {
                throw new Error('Error al eliminar el artículo.');
            }
        } catch (error) {
            alert('Ocurrió un error al intentar eliminar el artículo.');
        }
    };

    if (isLoading) {
        return <Carga />;
    }

    if (isError) {
        return <p className="has-text-centered">Error al cargar los artículos. Por favor, intenta de nuevo más tarde.</p>;
    }

    return (
        <div className="hero  ">
            <div className="hero-body">
                <div className="container has-text-centered">
                    <div className="card is-centered">
                        <div className="card-content">
                            <h1 className="title">Seleciona uno de tus articulos que deseas eliminar</h1>

                            {articulos.length > 0 ? (
                                <>
                                    <div className="select">
                                        <select 
                                            onChange={(e) => setArticuloSeleccionado(articulos.find(articulo => articulo.id === parseInt(e.target.value)))}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Selecciona un artículo</option>
                                            {articulos.map(articulo => (
                                                <option key={articulo.id} value={articulo.id}>
                                                    {articulo.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {articuloSeleccionado && (
                                        <div>
                                            <h2 className="subtitle">Título: {articuloSeleccionado.title}</h2>
                                            <p className="content">{articuloSeleccionado.abstract}</p>
                                            <figure>
                                                <img 
                                                    src={articuloSeleccionado.image} 
                                                    alt={articuloSeleccionado.caption || 'Article image'} 
                                                    style={{ maxWidth: '50%', height: 'auto' }} 
                                                />
                                                {articuloSeleccionado.caption && <figcaption>{articuloSeleccionado.caption}</figcaption>}
                                                </figure>
                                            <button className="button is-danger" onClick={() => handleEliminar(articuloSeleccionado.id)}>
                                                Eliminar Artículo
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p>No tienes artículos disponibles para eliminar.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteArticle;
