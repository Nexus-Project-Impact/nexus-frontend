// aqui estamos importando a API, para termos conexão com o back
import { api } from './api';

// ============================================================================
// AUTENTICAÇÃO BÁSICA (ENDPOINTS EXISTENTES)
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

// RESETAR SENHA: define nova senha usando token do email (REQUER AUTORIZAÇÃO)
export async function resetPassword(token, newPassword) {
  try {
    const response = await api.post('/Auth/reset-password', { token, newPassword });
    console.log('Senha resetada com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    throw error;
  }
}

// LOGOUT DO SERVIDOR: faz logout no servidor (REQUER AUTORIZAÇÃO)
async function logoutServer() {
  try {
    const response = await api.post('/Auth/logout');
    console.log('Logout realizado no servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer logout no servidor:', error);
    throw error;
  }
}

// LOGOUT: tenta logout no servidor, mas sempre limpa dados locais
export async function logout() {
  try {
    // Tenta fazer logout no servidor primeiro
    await logoutServer();
    console.log('Logout realizado no servidor e localmente');
  } catch (error) {
    console.warn('Não foi possível fazer logout no servidor, fazendo logout apenas local:', error);
  } finally {
    // SEMPRE limpa dados locais, independente do resultado do servidor
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
    // Se não conseguir decodificar, assume que é válido
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

// VERIFICAR SE É ADMIN: verifica se usuário tem role de admin
export function isAdmin() {
  try {
    const user = getUserFromToken();
    if (!user) return false;
    
    if (Array.isArray(user.roles)) {
      return user.roles.includes('Admin');
    } else {
      return user.roles === 'Admin';
    }
  } catch (error) {
    console.error('Erro ao verificar se é admin:', error);
    return false;
  }
}

// VERIFICAR ROLE ESPECÍFICA: verifica se usuário tem role específica
export function hasRole(roleName) {
  try {
    const user = getUserFromToken();
    if (!user) return false;
    
    if (Array.isArray(user.roles)) {
      return user.roles.includes(roleName);
    } else {
      return user.roles === roleName;
    }
  } catch (error) {
    console.error('Erro ao verificar role:', error);
    return false;
  }
}

// VERIFICAR EXPIRAÇÃO DO TOKEN
export function isTokenExpired() {
  const user = getUserFromToken();
  if (!user || !user.exp) return false;
  
  const currentTime = Date.now() / 1000;
  return user.exp < currentTime;
}

// OBTER TOKEN: retorna o token atual
export function getToken() {
  return localStorage.getItem('token');
}

// OBTER INFORMAÇÕES DO USUÁRIO LOGADO (DO TOKEN)
export function getCurrentUserInfo() {
  const user = getUserFromToken();
  if (!user) {
    throw new Error('Usuário não autenticado');
  }
  return user;
}

// AUTO-LOGIN: verifica se usuário pode fazer login automático
export function autoLogin() {
  try {
    if (!isAuthenticated()) {
      return false;
    }
    
    if (isTokenExpired()) {
      localStorage.removeItem('token');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Auto-login falhou:', error);
    return false;
  }
}
