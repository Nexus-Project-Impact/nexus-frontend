// DENTRO DE: src/services/api.js

import axios from 'axios';

// Use "export const" para criar uma exportação nomeada chamada "api"
export const api = axios.create({
  baseURL: 'https://localhost:7164/api/', // Coloque aqui a porta do seu backend
});