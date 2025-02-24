import { apiClient } from "../api/apiClient";

export const getPosts = async () => {
  const response = await apiClient.get("/posts");
  return response.data;
};