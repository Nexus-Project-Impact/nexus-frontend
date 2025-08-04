import { useState } from 'react';
import { register, forgotPassword, isAuthenticated } from '../services/authService';
import { notificationService } from '../services/notificationService';

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

  // Validações básicas apenas para UX (campos obrigatórios)
  const validateRequiredFields = () => {
    const errors = {};
    
    if (!name.trim()) errors.name = 'Nome é obrigatório';
    if (!email.trim()) errors.email = 'Email é obrigatório';
    if (!password.trim()) errors.password = 'Senha é obrigatória';
    if (!phone.trim()) errors.phone = 'Telefone é obrigatório';
    if (!cpf.trim()) errors.cpf = 'CPF é obrigatório';
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);
    setFieldErrors({});
    
    // Validação básica apenas para campos obrigatórios
    if (!validateRequiredFields()) {
      setError('Por favor, preencha todos os campos obrigatórios');
      setIsLoading(false);
      return;
    }
    
    try {
      // Limpar telefone e CPF antes de enviar (apenas números)
      const cleanPhone = phone.replace(/\D/g, '');
      const cleanCpf = cpf.replace(/\D/g, '');
      
      // 1. REGISTRAR USUÁRIO (validação real feita no backend)
      const registerData = await register(name.trim(), email.trim(), password, cleanPhone, cleanCpf);
      setSuccess(true);
      notificationService.auth.registerSuccess();
      
      // Limpar formulário após sucesso
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setCpf('');
      setFieldErrors({});
      
    } catch (err) {
      // O authService já faz log detalhado dos erros
      let errorMessage = 'Erro ao cadastrar usuário';
      
      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        
        // Mapear erros do backend para os campos do formulário
        const mappedErrors = {};
        Object.keys(backendErrors).forEach(field => {
          const fieldName = field.toLowerCase();
          const errorMessages = backendErrors[field];
          mappedErrors[fieldName] = Array.isArray(errorMessages) ? errorMessages[0] : errorMessages;
        });
        
        setFieldErrors(mappedErrors); // Usar apenas erros do backend
        
        // Usar o primeiro erro como mensagem principal
        const firstError = Object.values(backendErrors)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      notificationService.auth.registerError();
    } finally {
      setIsLoading(false);
    }
  };

  // FUNÇÃO PARA RECUPERAR SENHA (usando endpoint do authService)
  const handleForgotPassword = async (emailForReset) => {
    setIsLoading(true);
    setError('');
    
    try {
      await forgotPassword(emailForReset);
      notificationService.auth.forgotPasswordSuccess();
      return true;
    } catch (err) {
      let errorMessage = 'Erro ao solicitar recuperação de senha';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      notificationService.auth.forgotPasswordError();
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // VERIFICAR SE JÁ ESTÁ LOGADO
  const checkAuthStatus = () => {
    return isAuthenticated();
  };

  return {
    // Estados
    name, setName,
    email, setEmail,
    password, setPassword,
    phone, setPhone,
    cpf, setCpf,
    isLoading, setIsLoading,
    error, setError,
    success, setSuccess,
    fieldErrors,
    
    // Funções
    handleRegister,
    handleForgotPassword,
    checkAuthStatus
  };
}
