import { apiClient } from "../api/apiClient";

export const loginUser = async (credentials) => {
  const response = await apiClient.post("/auth/login", credentials);
  return response.data; // Devuelve el token
};

export const registerUser = async (userData) => {
  const response = await apiClient.post("/auth/register/user", userData);
  return response.data;
};

export const registerAdmin = async (adminData) => {
  const response = await apiClient.post("/auth/register/admin", adminData);
  return response.data;
};