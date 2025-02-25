import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegisterUser from "./pages/RegisterUser";
import RegisterAdmin from "./pages/RegisterAdmin";
import Posts from "./pages/Posts";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar"; // Importar el Navbar
import CreatePost from "./pages/CreatePost"; 


const App = () => {
  return (
    <div>
      <Navbar /> {/* ✅ Ahora el Navbar se renderiza en todas las páginas */}
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
