import { api } from './api';

// ============================================================================
// AUTENTICAÇÃO BÁSICA (ENDPOINTS EXISTENTES NO BACKEND)
// ============================================================================

// LOGIN: envia as credenciais e armazena o token no localStorage
export async function login(email, password) {
  try {
    const response = await api.post('/Auth/login', { email, password });
    console.log('Resposta completa do login:', response.data);
    
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

// LOGIN ADMIN: login específico para administradores
export async function login_admin(email, password){
  try {
    const response = await api.post('/Auth/login-admin', { email, password });
    console.log('Resposta completa do login admin:', response.data);

    const { token } = response.data;
    if (token) {
      localStorage.setItem('token', token);
    }
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer login admin:', error);
    throw error;
  }
}

// REGISTRO: registrar novo usuário
export async function register(name, email, password, phone, cpf) {
  try {
    const response = await api.post('/Auth/register', { name, email, password, phone, cpf });
    console.log('Sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro no registro:', error);
    
    if (error.response) {
      console.log(error.response.data);
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
      
      if (error.response.data && error.response.data.errors) {
        console.error('Lista de erros:', error.response.data.errors);
      }
    }
    
    throw error;
  }
}

// ESQUECEU A SENHA: envia email para reset (REQUER AUTORIZAÇÃO)
export async function forgotPassword(email) {
  try {
    const response = await api.post('/Auth/forgot-password', { email });
    console.log('Email de recuperação enviado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error);
    throw error;
  }
}

// LOGOUT: faz logout no servidor e limpa dados locais (REQUER AUTORIZAÇÃO)
export async function logout() {
  try {
    // Faz logout no servidor
    const response = await api.post('/Auth/logout');
    console.log('Logout realizado no servidor:', response.data);
    return response.data;
  } catch (error) {
    console.warn('Erro ao fazer logout no servidor:', error);
    throw error;
  } finally {
    // SEMPRE limpa dados locais
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    console.log('Dados locais limpos');
  }
}

// VERIFICAR SE ESTÁ LOGADO: verifica se token existe e é válido
export function isAuthenticated() {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Verifica se o token não está expirado (se for JWT)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp && payload.exp < currentTime) {
      localStorage.removeItem('token');
      return false;
    }
    
    return true;
  } catch (error) {
    return true;
  }
}

// OBTER DADOS DO TOKEN: extrai informações do JWT
export function getUserFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.sub || payload.userId || payload.id,
      email: payload.email,
      name: payload.name,
      roles: payload.role || payload.roles || [],
      exp: payload.exp
    };
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
}

// OBTER TOKEN: retorna o token atual
export function getToken() {
  return localStorage.getItem('token');
}
