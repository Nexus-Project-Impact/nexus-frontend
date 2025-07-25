// DENTRO DE: src/services/api.js

import axios from 'axios';

// Use "export const" para criar uma exportação nomeada chamada "api"
export const api = axios.create({
  baseURL: 'http://localhost:3333', // Coloque aqui a porta do seu backend
});