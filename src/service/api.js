// src/service/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ex: http://192.168.38.13:8085
  headers: { "Content-Type": "application/json" },
});

export default api;
