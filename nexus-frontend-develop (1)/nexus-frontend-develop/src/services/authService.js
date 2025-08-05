import { api } from './api';
import axios from 'axios';

// Instância do Axios sem interceptors para requisições anônimas
const anonymousApi = axios.create({
  baseURL: 'https://localhost:7164/',
  headers: {
    'Content-Type': 'application/json'
  }
});

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


export async function forgotPassword(email) {
  try {
    
    const response = await anonymousApi.post('/Auth/forgot-password', { email });
    console.log('Email de recuperação enviado:', response.data);
    
    return {
      success: response.data.success || true,
      message: response.data.message || 'Email de recuperação enviado'
    };
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error);
    throw error;
  }
}

export async function resetPasswordLoggedUser(currentPassword, newPassword) {
  try {
    // Para usuário logado - endpoint específico ou parâmetros diferentes
    const response = await api.post('/Auth/change-password', {
      currentPassword: currentPassword,
      newPassword: newPassword
    });
    console.log('Senha alterada com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    throw error;
  }
}

export async function resetPasswordWithCode(email, code, newPassword) {
  try {
    console.log('Tentando resetar senha com:', { email, code, newPassword });
    
    const response = await anonymousApi.post('/Auth/reset-password', {
      email: email,
      code: code,
      newPassword: newPassword
    });
    console.log('Senha resetada com código:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao resetar senha com código:', error);
    console.error('Detalhes do erro:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      message: error.response?.data?.message || error.message
    });
    
    if (error.response?.status === 401) {
      throw new Error('O endpoint reset-password requer autorização. Backend precisa ser ajustado para aceitar código sem token.');
    }
    
    throw error;
  }
}

// RESETAR SENHA COM TOKEN: redefine senha usando token do email (NÃO REQUER AUTORIZAÇÃO)
export async function resetPasswordWithToken(token, newPassword) {
  try {
    // Usar anonymousApi para não incluir token de autorização
    const response = await anonymousApi.post('/Auth/reset-password-with-token', {
      token: token,
      newPassword: newPassword
    });
    console.log('Senha resetada com token:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao resetar senha com token:', error);
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
