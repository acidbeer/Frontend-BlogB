import axios from "axios";

const API_URL = "http://127.0.0.1:8080/api/"; //url Backend

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});