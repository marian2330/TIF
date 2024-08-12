import React from 'react';

function Carga() {
  return (
    <div className="hero ">
      <div className="hero-body">
        <div className="container has-text-centered">
          <h1 className="title">Cargando...</h1>
          <progress className="progress is-primary is-small" max="100">Cargando...</progress>
        </div>
      </div>
    </div>
  );
}

export default Carga;
