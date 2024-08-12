import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Carga from './Carga'; // Importa el componente de carga si es necesario

export default function Home() {
    const [articles, setArticles] = useState([]);
    const [authorArticleCounts, setAuthorArticleCounts] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);

    useEffect(() => {
        // Función para obtener todos los artículos y contar artículos por autor
        const fetchAllArticles = async () => {
            let allArticles = [];
            let url = `${import.meta.env.VITE_API_BASE_URL}infosphere/articles/`;
            
            try {
                setIsLoading(true);
                
                while (url) {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error('Error al cargar noticias');
                    }
                    const data = await response.json();
                    allArticles = allArticles.concat(data.results);
                    url = data.next;
                }

                setArticles(allArticles);

                // Contar artículos por autor
                const counts = {};
                allArticles.forEach(article => {
                    counts[article.author] = (counts[article.author] || 0) + 1;
                });
                setAuthorArticleCounts(counts);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllArticles();
    }, []);

    if (isLoading) return <Carga message="Cargando noticias..." />;
    if (error) return <div>Error: {error}</div>;

    // Ordenar autores por la cantidad de artículos
    const sortedAuthors = Object.entries(authorArticleCounts)
        .map(([authorId, count]) => ({ authorId, count }))
        .sort((a, b) => b.count - a.count);

    return (
        <div className="container">
            <h1 className="title has-text-centered">Noticias Recientes</h1>
            <div className="columns is-multiline is-centered">
                {articles.length ? (
                    articles.slice(0, 5).map((article) => ( // Mostrar solo las noticias recientes
                        <div key={article.id} className="column is-one-third">
                            <div className="card">
                                <div className="card-image">
                                    <figure className="image is-4by3">
                                        <img src={article.image || 'https://bulma.io/assets/images/placeholders/1280x960.png'} alt={article.title} />
                                    </figure>
                                </div>
                                <div className="card-content">
                                    <p className="title is-4">{article.title}</p>
                                    <p className="subtitle is-6">{article.abstract}</p>
                                    <time dateTime={article.created_at}>{new Date(article.created_at).toLocaleString()}</time>
                                    <Link to={`/articles/${article.id}`} className="button is-primary">Leer más</Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="has-text-centered">No hay noticias disponibles</p>
                )}
            </div>
            
            <div className="container mt-5">
                <h2 className="title has-text-centered">Ranking de Autores</h2>
                <ul>
                    {sortedAuthors.map((author, index) => (
                        <li key={index}>
                            <strong>Autor ID {author.authorId}:</strong> {author.count} artículos
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
