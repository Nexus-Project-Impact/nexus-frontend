// DENTRO DE: src/services/api.js

import axios from 'axios';

// 1º passo: definir a URL/ENDPOIN base para integração com o backend
export const api = axios.create({
  baseURL: 'http://localhost:5235', // Coloque aqui a porta do seu backend

  headers: {
        'Content-Type' : 'application/json'
    }

});

// 2° passo: precisamos definir um interceptor para que o token JWT seja obtido
api.interceptors.request.use(
        // callback para interceptar o token
        (config) => {
            const token = localStorage.getItem('token');
            if(token){
                config.headers.Authorization = ` Bearer ${token}`;
            }
            return config;
        },

        (error) => Promise.reject(error)
);

// 3° passo
export default api;
