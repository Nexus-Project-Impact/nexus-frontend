// aqui estamos importando a API, para termos conexão com o back
import { api } from './api';

// LOGIN: envia as credenciais e armazena o token no localStorage
// aqui ela é async porque espera uma resposta do servidor
export async function login(email, password) {
  try {
    // aqui estamos chamando o método post Auth/login, da nossa api que contem a logica para logar
    const response = await api.post('/Auth/login', { email, password });
    const { token } = response.data; // armazenamos essa response no token
    if (token) { // se o login foi bem-sucedido ele guarda esse token no localStorage
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

// função para cadastrar novo usuário, ela envia do dados para a API
// e espera uma resposta
export async function register(name, email, password, phone, cpf) {
  const response = await api.post('/Auth/register', { name, email, password, phone, cpf });
  return response.data;
}
