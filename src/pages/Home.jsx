import React from "react";
import "./Home.css"; // Importamos el archivo de estilos

const Home = ({ titles, loading }) => {
  return (
    <div className="container">
      {/* Encabezado */}
      <header>
        <h1>📘 Bienvenido al Blog</h1>
      </header>

      {/* Contenido principal */}
      <main className="publicaciones">
        <h2>Últimas Publicaciones</h2>

        {loading ? (
          <p className="cargando">Cargando publicaciones...</p>
        ) : (
          <ul>
            {titles.map((title, index) => (
              <li key={index}>{title}</li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default Home;