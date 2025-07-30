// src/services/authService.js
import { api } from './api';

// LOGIN: envia as credenciais e armazena o token no localStorage
export async function login(email, password) {
  try {
    const response = await api.post('/Auth/login', { email, password });
    const { token } = response.data;
    if (token) {
      localStorage.setItem('token', token);
    }
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
}

// LOGOUT: remove o token do localStorage
export function logout() {
  localStorage.removeItem('token');
}

export async function register(name, email, password, phone, cpf) {
  const response = await api.post('/Auth/register', { name, email, password, phone, cpf });
  return response.data;
}
