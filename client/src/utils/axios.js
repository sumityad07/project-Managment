import axios from 'axios';


const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]'
);

const baseURL = isLocalhost
    ? 'http://localhost:5000/api'
    : 'https://project-managment-wcvv.onrender.com/api';

const api = axios.create({
    baseURL,
    withCredentials: true
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
