import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { apiClient } from "./api/apiClient"; // Importamos axios preconfigurado
import Login from "./pages/Login";
import RegisterUser from "./pages/RegisterUser";
import RegisterAdmin from "./pages/RegisterAdmin";
import Posts from "./pages/Posts";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar"; // Importar el Navbar
import CreatePost from "./pages/CreatePost"; 


const App = () => {
  const [titles, setTitles] = useState([]); // Estado para guardar los títulos
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    apiClient
    .get("/publicaciones")
    .then((response) => {
      setTitles(response.data.contenido.map(post => post.titulo)); // Extraer títulos
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error al obtener publicaciones:", error);
      setLoading(false);
    });
}, []);

  return (
    <div>
      <Navbar /> {/* Ahora el Navbar se renderiza en todas las páginas */}
      <h1>Bienvenido al Blog</h1>
      <h2 style={{ color: "blue" }}>Últimas Publicaciones</h2>

      {/*Mostrar las publicaciones fuera de <Routes> */}
      {loading ? (
        <p>Cargando publicaciones...</p>
      ) : (
        <ul>
          {titles.length > 0 ? (
            titles.map((titulo, index) => <li key={index}>{titulo}</li>)
          ) : (
            <p>No hay publicaciones disponibles.</p>
          )}
        </ul>
      )}

    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register-user" element={<RegisterUser />} />
      <Route path="/register-admin" element={<RegisterAdmin />} />
      <Route path="/crear-publicacion" element={<CreatePost />} />
      <Route path="/posts" element={<Posts />} />
      
      <Route path="/" element={<h1>Bienvenido al Blog</h1>} />
       {/*La página de publicaciones está protegida */}
       <Route path="/posts" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
    </Routes>
    </div>
  );
};

export default App;
