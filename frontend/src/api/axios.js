import axios from 'axios';

// Load token from localStorage or wherever you save it
const token = localStorage.getItem('token');

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
  }
});

export default api;