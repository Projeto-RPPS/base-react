import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
   headers: {
    'Content-Type': 'application/json',
  },
});

export function setToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem('token');
  }
}

const saved = localStorage.getItem('token');
if (saved) api.defaults.headers.common.Authorization = `Bearer ${saved}`;

export default api;
