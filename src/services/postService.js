import { apiClient } from "../api/apiClient";

const API_URL = "http://127.0.0.1:8080/api/publicaciones";


// Obtener todas las publicaciones
export const getPosts = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Error al obtener las publicaciones");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getPosts:", error);
    return [];
  }
};

//  Crear una nueva publicación (solo para ADMIN)
export const createPost = async (post, token) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error("Error al crear la publicación");
  }
  return response.json();
};

// ✅ Actualizar una publicación (solo para ADMIN)
export const updatePost = async (postId, post, token) => {
  const response = await fetch(`${API_URL}/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar la publicación");
  }
  return response.json();
};

// ✅ Eliminar una publicación (solo para ADMIN)
export const deletePost = async (postId, token) => {
  const response = await fetch(`${API_URL}/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al eliminar la publicación");
  }
};

// ✅ Agregar un comentario (Cualquier usuario autenticado)
export const addComment = async (postId, commentData, token) => {
  try {
    const response = await fetch(`${API_URL}/${postId}/comentarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Enviar token de autenticación
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      throw new Error("⚠️ Error al agregar el comentario.");
    }

    return await response.json(); // Devuelve el comentario creado
  } catch (error) {
    console.error("🚨 Error en addComment:", error);
    throw error;
  }
};

// ✅ Modificar un comentario (Solo ADMIN)
export const updateComment = async (postId, commentId, updatedData, token) => {
  try {
    const response = await fetch(`${API_URL}/${postId}/comentarios/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("⚠️ Error al actualizar el comentario.");
    }

    return await response.json();
  } catch (error) {
    console.error("🚨 Error en updateComment:", error);
    throw error;
  }
};

// ✅ Eliminar un comentario (Solo ADMIN)
export const deleteComment = async (postId, commentId, token) => {
  try {
    const response = await fetch(`${API_URL}/${postId}/comentarios/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("⚠️ Error al eliminar el comentario.");
    }

    return true; // Confirmar eliminación
  } catch (error) {
    console.error("🚨 Error en deleteComment:", error);
    throw error;
  }
};
