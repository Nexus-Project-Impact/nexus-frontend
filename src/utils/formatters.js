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

// Formatar valor monetário para input (sem símbolo de moeda)
export const formatCurrencyInput = (value) => {
  // Remove tudo que não é número ou vírgula/ponto
  const numbers = value.replace(/[^\d,.-]/g, '');
  
  // Remove pontos e vírgulas extras, mantendo apenas a última como decimal
  const cleaned = numbers.replace(/[.,]/g, (match, offset, string) => {
    const lastDot = string.lastIndexOf('.');
    const lastComma = string.lastIndexOf(',');
    const lastSeparator = Math.max(lastDot, lastComma);
    
    if (offset === lastSeparator && (string.length - offset - 1) <= 2) {
      return '.'; // Decimal separator
    }
    return ''; // Remove other separators
  });
  
  // Parse and format
  const num = parseFloat(cleaned) || 0;
  return num.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
};

// Converter valor formatado para número decimal para envio à API
export const parseCurrencyInput = (formattedValue) => {
  if (!formattedValue) return 0;
  
  // Remove separadores de milhar e converte vírgula decimal para ponto
  const cleaned = formattedValue
    .replace(/\./g, '') // Remove pontos (separadores de milhar)
    .replace(',', '.'); // Converte vírgula para ponto decimal
  
  return parseFloat(cleaned) || 0;
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

export const formatDate = (value) => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
};

export const validateDate = (date) => {
  const cleanDate = date.replace(/\D/g, '');
  
  // Verifica se tem 8 dígitos
  if (cleanDate.length !== 8) return false;
  
  const day = parseInt(cleanDate.substring(0, 2));
  const month = parseInt(cleanDate.substring(2, 4));
  const year = parseInt(cleanDate.substring(4, 8));
  
  // Validações básicas
  if (day < 1 || day > 31) return false;
  if (month < 1 || month > 12) return false;
  if (year < 1900 || year > 2100) return false;
  
  // Verifica se a data é válida
  const dateObj = new Date(year, month - 1, day);
  return dateObj.getDate() === day && 
         dateObj.getMonth() === (month - 1) && 
         dateObj.getFullYear() === year;
};

// Converte data do formato brasileiro (dd/mm/yyyy) para ISO (yyyy-mm-dd)
export const convertBRDateToISO = (brDate) => {
  if (!brDate || brDate.length !== 10) return '';
  
  const [day, month, year] = brDate.split('/');
  if (!day || !month || !year) return '';
  
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Converte data do formato ISO (yyyy-mm-dd) para brasileiro (dd/mm/yyyy)
export const convertISODateToBR = (isoDate) => {
  if (!isoDate) return '';
  
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    return '';
  }
};
