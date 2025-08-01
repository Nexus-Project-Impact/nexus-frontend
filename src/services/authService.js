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

// export async function register(name, email, password, phone, cpf) {
//   const response = await api.post('/Auth/register', { name, email, password, phone, cpf });
//   console.log(response.data);
//   return response.data;
// }

export async function register(name, email, password, phone, cpf) {
  try {
    const response = await api.post('/Auth/register', { name, email, password, phone, cpf });
    console.log('Sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro no registro:', error);
    
    // Log detalhado do erro
    if (error.response) {
      console.log(error.response.data);
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
      
      // Se o backend retorna lista de erros
      if (error.response.data && error.response.data.errors) {
        console.error('Lista de erros:', error.response.data.errors);
      }
    }
    
    throw error; // Re-throw para que o componente possa tratar
  }
}