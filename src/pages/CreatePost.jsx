import { useState } from "react";
import { createPost } from "../services/postService";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import styles from "./CreatePost.module.css"; // ✅ Importar el CSS Module

const CreatePost = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState({ titulo: "", descripcion: "", contenido: "" });

  // ✅ Solo ADMIN puede acceder
  if (!user?.roles.includes("ROLE_ADMIN")) {
    navigate("/posts");
    return null;
  }

  // ✅ Crear publicación
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await createPost(newPost, token);
      navigate("/posts"); // Redirigir después de publicar
    } catch (error) {
      console.error("Error al crear la publicación:", error);
    }
  };

  return (
    <div className={styles.container}>
    <h2>Crear Publicación</h2>
    <form onSubmit={handleCreatePost} className={styles.form}>
      <input
        type="text"
        placeholder="Título"
        value={newPost.titulo}
        onChange={(e) => setNewPost({ ...newPost, titulo: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Descripción"
        value={newPost.descripcion}
        onChange={(e) => setNewPost({ ...newPost, descripcion: e.target.value })}
        required
      />
      <textarea
        placeholder="Contenido"
        value={newPost.contenido}
        onChange={(e) => setNewPost({ ...newPost, contenido: e.target.value })}
        required
      />
      <button type="submit">Publicar</button>
    </form>
  </div>
  );
};



export default CreatePost;