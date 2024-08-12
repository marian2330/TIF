import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Carga from '../Carga'; 
import { useAuth } from '../../contexts/AuthContext'; 

function Articles() {
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const [authorProfile, setAuthorProfile] = useState(null);
  const { id } = useParams();
  const { token, logout } = useAuth("state");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login'); 
      return;
    }

    // Fetch del artículo
    fetch(`${import.meta.env.VITE_API_BASE_URL}infosphere/articles/${id}`, {
      headers: {
        'Authorization': `Token ${token}`,
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch the article');
        }
        return response.json();
      })
      .then(data => {
        setArticle(data);

        // Fetch del perfil del autor
        return fetch(`${import.meta.env.VITE_API_BASE_URL}users/profiles/${data.author}/`, {
          headers: {
            'Authorization': `Token ${token}`,
          }
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch author profile');
        }
        return response.json();
      })
      .then(profileData => {
        setAuthorProfile(profileData);
      })
      .catch(error => {
        setError(error.message);
      });
  }, [id, token, navigate]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Mostrar el componente de carga mientras se obtienen los datos
  if (!article || !authorProfile) {
    return <Carga />;
  }

  return (
    <div className="container is-max-desktop is-flex is-justify-content-center is-align-items-center" style={{ minHeight: '100vh' }}>
      <div className="content has-text-centered">
        <h1>{article.title}</h1>
        <p>{article.abstract}</p>
        <figure>
          <img 
            src={article.image} 
            alt={article.caption || 'Article image'} 
            style={{ maxWidth: '50%', height: 'auto' }} 
          />
          {article.caption && <figcaption>{article.caption}</figcaption>}
        </figure>
        <p>{article.content}</p>
        {authorProfile && (
          <p>
            <strong>Author:</strong> {`${authorProfile.first_name} ${authorProfile.last_name}`}
          </p>
        )}
        <p><strong>Views:</strong> {article.view_count}</p>
        <button className="button is-danger" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Articles;
