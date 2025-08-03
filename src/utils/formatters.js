// Utilitários para formatação e validação

export const formatPhone = (value) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
};

export const formatCpf = (value) => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
};

export const validateCpf = (cpf) => {
  // Remove pontos e traços
  const cleanCpf = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCpf.length !== 11) return false;
  
  return true;
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Deve ter 10 dígitos (fixo) ou 11 dígitos (celular)
  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    return false;
  }
  
  // Se tem 11 dígitos, o terceiro deve ser 9 (celular)
  if (cleanPhone.length === 11 && cleanPhone[2] !== '9') {
    return false;
  }
  
  // Se tem 10 dígitos, o terceiro não pode ser 9
  if (cleanPhone.length === 10 && cleanPhone[2] === '9') {
    return false;
  }
  
  return true;
};
