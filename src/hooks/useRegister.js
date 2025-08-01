import { useState } from 'react';
import { register } from '../services/authService';
import { validateCpf as isValidCpf, validateEmail as isValidEmail, validatePhone as isValidPhone } from '../utils/formatters';

export function useRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Funções de validação
  const validateName = (value) => {
    if (!value.trim()) return 'Nome é obrigatório';
    if (value.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
    return '';
  };

  const validateEmailField = (value) => {
    if (!value.trim()) return 'Email é obrigatório';
    if (!isValidEmail(value)) return 'Email deve ter um formato válido';
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return 'Senha é obrigatória';
    if (value.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
    if (!/(?=.*[a-z])/.test(value)) return 'Senha deve conter pelo menos uma letra minúscula';
    if (!/(?=.*[A-Z])/.test(value)) return 'Senha deve conter pelo menos uma letra maiúscula';
    if (!/(?=.*\d)/.test(value)) return 'Senha deve conter pelo menos um número';
    return '';
  };

  const validatePhoneField = (value) => {
    if (!value.trim()) return 'Telefone é obrigatório';
    if (!isValidPhone(value)) return 'Telefone deve ter formato válido (10 ou 11 dígitos)';
    return '';
  };

  const validateCpfField = (value) => {
    if (!value.trim()) return 'CPF é obrigatório';
    if (!isValidCpf(value)) return 'CPF inválido';
    return '';
  };

  // Função para validar um campo específico
  const validateField = (fieldName, value) => {
    let errorMessage = '';
    
    switch (fieldName) {
      case 'name':
        errorMessage = validateName(value);
        break;
      case 'email':
        errorMessage = validateEmailField(value);
        break;
      case 'password':
        errorMessage = validatePassword(value);
        break;
      case 'phone':
        errorMessage = validatePhoneField(value);
        break;
      case 'cpf':
        errorMessage = validateCpfField(value);
        break;
      default:
        break;
    }

    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));

    return errorMessage === '';
  };

  // Setters com validação
  const setNameWithValidation = (value) => {
    setName(value);
    validateField('name', value);
  };

  const setEmailWithValidation = (value) => {
    setEmail(value);
    validateField('email', value);
  };

  const setPasswordWithValidation = (value) => {
    setPassword(value);
    validateField('password', value);
  };

  const setPhoneWithValidation = (value) => {
    setPhone(value);
    validateField('phone', value);
  };

  const setCpfWithValidation = (value) => {
    setCpf(value);
    validateField('cpf', value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);
    
    // Validar todos os campos antes de enviar
    const nameValid = validateField('name', name);
    const emailValid = validateField('email', email);
    const passwordValid = validateField('password', password);
    const phoneValid = validateField('phone', phone);
    const cpfValid = validateField('cpf', cpf);
    
    // Se algum campo for inválido, não enviar
    if (!nameValid || !emailValid || !passwordValid || !phoneValid || !cpfValid) {
      setError('Por favor, corrija os erros nos campos antes de continuar');
      setIsLoading(false);
      return;
    }
    
    try {
      // Limpar telefone e CPF antes de enviar (apenas números)
      const cleanPhone = phone.replace(/\D/g, '');
      const cleanCpf = cpf.replace(/\D/g, '');
      
      const data = await register(name, email, password, cleanPhone, cleanCpf);
      setSuccess(true);
      
      // Limpar formulário após sucesso
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setCpf('');
      setFieldErrors({});
      
    } catch (err) {
      console.error('Erro capturado no hook:', err);
      
      let errorMessage = 'Erro ao cadastrar usuário';
      
      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        console.log('Erros de validação:', backendErrors);
        
        const mappedErrors = {};
        Object.keys(backendErrors).forEach(field => {
          const fieldName = field.toLowerCase();
          const errorMessages = backendErrors[field];
          if (Array.isArray(errorMessages)) {
            mappedErrors[fieldName] = errorMessages[0];
          } else {
            mappedErrors[fieldName] = errorMessages;
          }
        });
        
        setFieldErrors(prev => ({ ...prev, ...mappedErrors }));
        
        const firstField = Object.keys(backendErrors)[0];
        const firstError = backendErrors[firstField];
        
        if (Array.isArray(firstError)) {
          errorMessage = firstError[0];
        } else {
          errorMessage = firstError;
        }
        
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name, setName: setNameWithValidation,
    email, setEmail: setEmailWithValidation,
    password, setPassword: setPasswordWithValidation,
    phone, setPhone: setPhoneWithValidation,
    cpf, setCpf: setCpfWithValidation,
    isLoading, setIsLoading,
    error, setError,
    success, setSuccess,
    fieldErrors,
    handleRegister
  };
}
