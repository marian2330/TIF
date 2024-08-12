import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Carga from '../Carga'; 
import { useAuth } from "../../contexts/AuthContext";

function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [nextUrl, setNextUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authorProfiles, setAuthorProfiles] = useState({});

  const { token } = useAuth("state");
  const observerRef = useRef();
  const lastArticleElementRef = useRef();
  const navigate = useNavigate();

  const doFetch = async () => {
    setIsLoading(true);

    let query = new URLSearchParams({
      page: page,
      page_size: 5,
      ordering: `-created_at`,
    }).toString();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}infosphere/articles/?${query}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      const data = await response.json();
      if (data.results) {
        setArticles((prevArticles) => [...prevArticles, ...data.results]);
        setNextUrl(data.next);

        // Fetch para obtener perfiles de autores
        const newAuthorProfiles = {};
        for (const article of data.results) {
          if (!authorProfiles[article.author]) {
            try {
              const profileResponse = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}users/profiles/${article.author}/`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Token ${token}`,
                  }
                }
              );
              if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                newAuthorProfiles[article.author] = profileData;
              } else {
                console.error(`Failed to fetch profile for author ${article.author}: ${profileResponse.status}`);
              }
            } catch (profileError) {
              console.error(`Error fetching profile for author ${article.author}:`, profileError);
            }
          }
        }
        setAuthorProfiles((prevProfiles) => ({ ...prevProfiles, ...newAuthorProfiles }));
      }
    } catch (fetchError) {
      console.error("Error fetching articles:", fetchError);
      setError('Failed to fetch articles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    doFetch();
  }, [page]);

  useEffect(() => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextUrl) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (lastArticleElementRef.current) {
      observerRef.current.observe(lastArticleElementRef.current);
    }
  }, [isLoading, nextUrl]);

  if (error) return <div>Error: {error}</div>;
  if (isLoading && !articles.length) return <Carga />; // Mostrar carga si aún no hay artículos y está cargando

  return (
    <div className="content">
      <div className="container">
        <h1 className="title has-text-centered">Lista de Artículos</h1>
        <div className="columns is-multiline is-centered">
          {articles.map((article, index) => {
            const authorProfile = authorProfiles[article.author];
            const authorName = authorProfile 
              ? `${authorProfile.first_name || ''} ${authorProfile.last_name || ''}`.trim() 
              : 'Cargando autor...';

            return (
              <div 
                key={article.id} 
                className="column is-one-third" 
                onClick={() => navigate(`/articles/${article.id}`)} 
                style={{ cursor: 'pointer' }}
                ref={articles.length === index + 1 ? lastArticleElementRef : null}
              >
                <div className="card">
                  <div className="card-image">
                    <figure className="image is-4by3">
                      <img src={article.image || 'https://bulma.io/assets/images/placeholders/1280x960.png'} alt={article.title} />
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="media">
                      <div className="media-left">
                        <figure className="image is-48x48">
                          <img 
                            src={authorProfile?.image ? `${import.meta.env.VITE_API_BASE_URL}${authorProfile.image}` : 'https://bulma.io/assets/images/placeholders/96x96.png'} 
                            alt="Author" 
                          />
                        </figure>
                      </div>
                      <div className="media-content">
                        <p className="title is-4">{article.title}</p>
                        <p className="subtitle is-6">{authorName}</p>
                      </div>
                    </div>
                    <div className="content">
                      {article.abstract}
                      <br />
                      <time dateTime={article.created_at}>{new Date(article.created_at).toLocaleString()}</time>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {isLoading && !articles.length && <p className="has-text-centered">Cargando más artículos...</p>}
      </div>
    </div>
  );
}

export default ArticlesList;
