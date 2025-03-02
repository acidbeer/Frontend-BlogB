import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { apiClient } from "./api/apiClient"; // Importamos axios preconfigurado
import Home from "./pages/Home";
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
    {/* ✅ Agregar Navbar para que se muestre en todas las páginas */}
    <Navbar />

    {/* ✅ Colocar Routes correctamente */}
    <Routes>
      <Route path="/" element={<Home titles={titles} loading={loading} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register-user" element={<RegisterUser />} />
      <Route path="/register-admin" element={<RegisterAdmin />} />
      <Route path="/crear-publicacion" element={<CreatePost />} />
      <Route path="/posts" element={<Posts />} />
      
      <Route path="/" />
       {/*La página de publicaciones está protegida */}
       <Route path="/posts" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
    </Routes>
</div>
  );
};

export default App;
