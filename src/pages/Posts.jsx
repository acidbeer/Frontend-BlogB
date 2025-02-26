import { useEffect, useState } from "react";
import { getPosts, createPost, updatePost, deletePost, addComment, updateComment, deleteComment } from "../services/postService";
import { useAuth } from "../hooks/useAuth";  // Importar useAuth
import { useNavigate, Link } from "react-router-dom"; //  Para redireccionar
import styles from "../styles/Posts.module.css";  // ✅ Importar los estilos correctamente



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
      console.error(" Error al agregar el comentario:", error);
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
    <div className={styles.postsContainer}>
      <h1 className={styles.postsTitle}>Publicaciones</h1>

      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className={styles.postCard}>
            {editingPost?.id === post.id ? (
              <div className={styles.editForm}>
                <input
                  type="text"
                  value={editingPost.titulo}
                  onChange={(e) => setEditingPost({ ...editingPost, titulo: e.target.value })}
                  className={styles.inputField}
                  placeholder="Nuevo título"
                />
                <input
                  type="text"
                  value={editingPost.descripcion}
                  onChange={(e) => setEditingPost({ ...editingPost, descripcion: e.target.value })}
                  className={styles.inputField}
                  placeholder="Nueva descripción"
                />
                <textarea
                  value={editingPost.contenido}
                  onChange={(e) => setEditingPost({ ...editingPost, contenido: e.target.value })}
                  className={styles.textArea}
                  placeholder="Nuevo contenido"
                />
                <div className={styles.buttonGroup}>
                  <button onClick={() => handleEditPost(post.id)} className={styles.button}>
                    Guardar
                  </button>
                  <button onClick={() => setEditingPost(null)} className={styles.buttonDanger}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className={styles.postTitle}>{post.titulo}</h2>
                <p className={styles.postDescription}><strong>Descripción:</strong> {post.descripcion}</p>
                <p className={styles.postContent}><strong>Contenido:</strong> {post.contenido}</p>

                <div className={styles.commentContainer}>
                  <h3>Comentarios:</h3>
                  {post.comentarios && post.comentarios.length > 0 ? (
                    <ul>
                      {post.comentarios.map((comentario) => (
                        <li key={comentario.id} className={styles.commentItem}>
                          {editingComment?.id === comentario.id ? (
                            <>
                              <input
                                type="text"
                                value={editingComment.cuerpo}
                                onChange={(e) => setEditingComment({ ...editingComment, cuerpo: e.target.value })}
                                className={styles.inputField}
                              />
                              <button onClick={() => handleEditComment(post.id, comentario.id)} className={styles.button}>Guardar</button>
                              <button onClick={() => setEditingComment(null)} className={styles.buttonDanger}>Cancelar</button>
                            </>
                          ) : (
                            <>
                              <p className={styles.commentText}><strong>{comentario.nombre}</strong></p>
                              <p>{comentario.cuerpo}</p>
                              {user?.roles.includes("ROLE_ADMIN") && (
                                <div className={styles.buttonGroup}>
                                  <button onClick={() => setEditingComment(comentario)} className={styles.button}>Editar</button>
                                  <button onClick={() => handleDeleteComment(post.id, comentario.id)} className={styles.buttonDanger}>Eliminar</button>
                                </div>
                              )}
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No hay comentarios.</p>
                  )}
                </div>
              
                <input 
                 type="text" 
                 placeholder="Escribe un comentario..." 
                 className={styles.inputField} 
                 value={newComment[post.id] || ""} 
                 onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })} 
                 />

                <div className={styles.buttonGroupP}>
                <button onClick={() => handleAddComment(post.id)} className={styles.button}>
                  Comentar
                </button>

                {user?.roles.includes("ROLE_ADMIN") && (
                <>
                <button onClick={() => setEditingPost({ ...post })} className={styles.button}>
                  Editar Publicación
                </button>
                <button onClick={() => handleDeletePost(post.id)} className={styles.buttonDanger}>
                  Eliminar Publicación
                </button>
               </>
            )}
          </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p>No hay publicaciones disponibles.</p>
      )}
    </div>
  );
};



export default Posts;