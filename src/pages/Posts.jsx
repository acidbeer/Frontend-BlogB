import { useEffect, useState } from "react";
import { getPosts, createPost, updatePost, deletePost, addComment, updateComment, deleteComment } from "../services/postService";
import { useAuth } from "../hooks/useAuth";  // Importar useAuth
import { useNavigate, Link } from "react-router-dom"; //  Para redireccionar


const Posts = () => {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState({ titulo: "", descripcion: "", contenido: "" });
  const [showCreateForm, setShowCreateForm] = useState(false); // ✅ Controlar visibilidad del formulario
  const [editingPost, setEditingPost] = useState(null);
  const [newComment, setNewComment] = useState({});
  const [editingComment, setEditingComment] = useState(null);

   // ✅ Cargar publicaciones al montar el componente
   useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        console.log("Publicaciones recibidas:", response);
  
        // Extraer solo el array de contenido
        setPosts(response.contenido);
      } catch (error) {
        console.error("Error al obtener publicaciones:", error);
      }
    };
    fetchPosts();
  }, []);

  // ✅ Crear una nueva publicación
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user?.roles.includes("ROLE_ADMIN") || !token) return;

    try {
      const createdPost = await createPost(newPost, token);
      setPosts((prevPosts) => [...prevPosts, createdPost]); 
      setNewPost({ titulo: "", descripcion: "", contenido: "" });
    } catch (error) {
      console.error("Error al crear la publicación:", error);
    }
  };

  // ✅ Editar una publicación
  const handleEditPost = async (postId) => {
    if (!user?.roles.includes("ROLE_ADMIN") || !token) return;

    try {
      const updatedPost = await updatePost(postId, editingPost, token);
      setPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? updatedPost : post)));
      setEditingPost(null);
    } catch (error) {
      console.error("Error al actualizar la publicación:", error);
    }
  };

  // ✅ Eliminar una publicación
  const handleDeletePost = async (postId) => {
    if (!user?.roles.includes("ROLE_ADMIN") || !token) return;

    try {
      await deletePost(postId, token);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error al eliminar la publicación:", error);
    }
  };

  // ✅ Agregar comentario (Cualquier usuario autenticado)
  const handleAddComment = async (postId) => {
    if (!newComment[postId]) return;

    const commentData = {
      nombre: user?.username || "anonimo",
      email: user?.email || "anonimo@gmail",
      cuerpo: newComment[postId],
    };
    try {
      const createdComment = await addComment(postId, commentData, token);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comentarios: [...post.comentarios, createdComment] }
            : post
        )
      );
      setNewComment({ ...newComment, [postId]: "" });
    } catch (error) {
      console.error("🚨 Error al agregar el comentario:", error);
    }
  };

  // ✅ Modificar comentario (Solo ADMIN)
  const handleEditComment = async (postId, commentId) => {
    if (!user?.roles.includes("ROLE_ADMIN")) return;

    try {
      const updatedComment = await updateComment(postId, commentId, editingComment, token);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comentarios: post.comentarios.map((comment) =>
                  comment.id === commentId ? updatedComment : comment
                ),
              }
            : post
        )
      );
      setEditingComment(null);
    } catch (error) {
      console.error("🚨 Error al actualizar el comentario:", error);
    }
  };

  // ✅ Eliminar comentario (Solo ADMIN)
  const handleDeleteComment = async (postId, commentId) => {
    if (!user?.roles.includes("ROLE_ADMIN")) return;

    try {
      await deleteComment(postId, commentId, token);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comentarios: post.comentarios.filter((c) => c.id !== commentId) }
            : post
        )
      );
    } catch (error) {
      console.error("🚨 Error al eliminar el comentario:", error);
    }
  };

  return (
    <div>
      <h1>Publicaciones</h1>

      {/* ✅ Listar todas las publicaciones */}
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} style={styles.postCard}>
            {editingPost?.id === post.id ? (
              <div>
                <input
                  type="text"
                  value={editingPost.titulo}
                  onChange={(e) => setEditingPost({ ...editingPost, titulo: e.target.value })}
                />
                <input
                  type="text"
                  value={editingPost.descripcion}
                  onChange={(e) => setEditingPost({ ...editingPost, descripcion: e.target.value })}
                />
                <textarea
                  value={editingPost.contenido}
                  onChange={(e) => setEditingPost({ ...editingPost, contenido: e.target.value })}
                />
                <button onClick={() => handleEditPost(post.id)}>Guardar</button>
                <button onClick={() => setEditingPost(null)}>Cancelar</button>
              </div>
            ) : (
              <div>
                <h2>{post.titulo}</h2>
                <p><strong>Descripción:</strong> {post.descripcion}</p>
                <p><strong>Contenido:</strong> {post.contenido}</p>

                {/* ✅ Sección de comentarios */}
                <h3>Comentarios:</h3>
                {post.comentarios && post.comentarios.length > 0 ? (
                  <ul style={styles.commentList}>
                    {post.comentarios.map((comentario) => (
                      <li key={comentario.id} style={styles.commentItem}>
                        <p><strong>{comentario.nombre}</strong></p>
                        <p>{comentario.cuerpo}</p>

                {/* ✅ Edición y eliminación solo para ADMIN */}
                {user?.roles.includes("ROLE_ADMIN") && (
                      <>
                        <button onClick={() => setEditingComment(comentario)}>EditarComentario</button>
                        <button onClick={() => handleDeleteComment(post.id, comentario.id)}>EliminarComentario</button>
                      </>
                    )}        
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay comentarios.</p>
                )}

                {/* ✅ Agregar comentario */}
                <div>
                  <input
                    type="text"
                    placeholder="Escribe un comentario..."
                    value={newComment[post.id] || ""}
                    onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                    style={styles.input}
                  />
                  <button onClick={() => handleAddComment(post.id)} style={styles.commentButton}>
                    Comentar
                  </button>
                </div>

                {/* ✅ Mostrar botones de edición y eliminación solo para ADMIN */}
                {user?.roles.includes("ROLE_ADMIN") && (
                  <>
                    <button onClick={() => setEditingPost({ ...post })}>EditarPublicacion</button>
                    <button onClick={() => handleDeletePost(post.id)}>EliminarPublicacion</button>
                  </>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No hay publicaciones disponibles.</p>
      )}
    </div>
  );
};

//✅ Estilos para mejorar la UI
const styles = {
  createButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  createFormContainer: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  createForm: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  postsContainer: {
    marginTop: "20px",
  },
  postCard: {
    border: "1px solid #ddd",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  },
  commentList: {
    listStyleType: "none",
    padding: 0,
  },
  commentItem: {
    border: "1px dashed #999",
    padding: "5px",
    marginBottom: "5px",
    backgroundColor: "#fff",
  },
};

export default Posts;