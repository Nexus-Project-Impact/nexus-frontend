// Service para gerenciar usuários integrado com Microsoft.AspNetCore.Identity
import { api } from './api';

// BUSCAR PERFIL DO USUÁRIO LOGADO
export async function getUserProfile() {
  try {
    const response = await api.get('/User/profile');
    console.log('Perfil do usuário:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    throw error;
  }
}

// BUSCAR USUÁRIO POR ID
export async function getUserById(userId) {
  try {
    const response = await api.get(`/User/${userId}`);
    console.log('Usuário encontrado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    throw error;
  }
}

// LISTAR TODOS OS USUÁRIOS (Admin)
export async function getAllUsers(page = 1, pageSize = 10) {
  try {
    const response = await api.get(`/User?page=${page}&pageSize=${pageSize}`);
    console.log('Lista de usuários:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    throw error;
  }
}

// ATUALIZAR PERFIL DO USUÁRIO
export async function updateUserProfile(userData) {
  try {
    const { name, phone, cpf } = userData;
    const response = await api.put('/User/profile', { 
      name, 
      phone, 
      cpf 
    });
    console.log('Perfil atualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    
    // Log detalhado do erro
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      
      if (error.response.data && error.response.data.errors) {
        console.error('Lista de erros:', error.response.data.errors);
      }
    }
    
    throw error;
  }
}

// ATUALIZAR USUÁRIO POR ID (Admin)
export async function updateUserById(userId, userData) {
  try {
    const { name, email, phone, cpf } = userData;
    const response = await api.put(`/User/${userId}`, { 
      name, 
      email, 
      phone, 
      cpf 
    });
    console.log('Usuário atualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      
      if (error.response.data && error.response.data.errors) {
        console.error('Lista de erros:', error.response.data.errors);
      }
    }
    
    throw error;
  }
}

// DELETAR USUÁRIO (Admin)
export async function deleteUser(userId) {
  try {
    const response = await api.delete(`/User/${userId}`);
    console.log('Usuário deletado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
}

// BUSCAR USUÁRIOS POR FILTRO
export async function searchUsers(searchTerm, filter = 'name') {
  try {
    const response = await api.get(`/User/search?term=${encodeURIComponent(searchTerm)}&filter=${filter}`);
    console.log('Usuários encontrados:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
}

// ALTERAR SENHA
export async function changePassword(currentPassword, newPassword) {
  try {
    const response = await api.post('/User/change-password', {
      currentPassword,
      newPassword
    });
    console.log('Senha alterada com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      
      if (error.response.data && error.response.data.errors) {
        console.error('Lista de erros:', error.response.data.errors);
      }
    }
    
    throw error;
  }
}

// CONFIRMAR EMAIL
export async function confirmEmail(userId, token) {
  try {
    const response = await api.post('/User/confirm-email', {
      userId,
      token
    });
    console.log('Email confirmado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao confirmar email:', error);
    throw error;
  }
}

// REENVIAR EMAIL DE CONFIRMAÇÃO
export async function resendConfirmationEmail(email) {
  try {
    const response = await api.post('/User/resend-confirmation', { email });
    console.log('Email de confirmação reenviado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao reenviar email de confirmação:', error);
    throw error;
  }
}

// GERENCIAR ROLES DO USUÁRIO (Admin)
export async function addRoleToUser(userId, roleName) {
  try {
    const response = await api.post(`/User/${userId}/roles`, { roleName });
    console.log('Role adicionada ao usuário:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar role ao usuário:', error);
    throw error;
  }
}

export async function removeRoleFromUser(userId, roleName) {
  try {
    const response = await api.delete(`/User/${userId}/roles/${roleName}`);
    console.log('Role removida do usuário:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao remover role do usuário:', error);
    throw error;
  }
}

// LISTAR ROLES DO USUÁRIO
export async function getUserRoles(userId) {
  try {
    const response = await api.get(`/User/${userId}/roles`);
    console.log('Roles do usuário:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar roles do usuário:', error);
    throw error;
  }
}

// VALIDAR CPF (função auxiliar)
export function validateCPF(cpf) {
  // Remove caracteres especiais
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 === 10 || digit1 === 11) digit1 = 0;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 === 10 || digit2 === 11) digit2 = 0;
  
  return digit1 === parseInt(cleanCPF.charAt(9)) && digit2 === parseInt(cleanCPF.charAt(10));
}

// FORMATAR CPF (função auxiliar)
export function formatCPF(cpf) {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// FORMATAR TELEFONE (função auxiliar)
export function formatPhone(phone) {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
}