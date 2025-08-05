import { useState } from 'react';
import { forgotPassword } from '../services/authService';
import { notificationService } from '../services/notificationService';

export function useForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    if (!email?.trim()) {
      setError('Email é obrigatório');
      setIsLoading(false);
      return false;
    }

    try {
      // Chamar forgotPassword do authService
      await forgotPassword(email.trim());
      
      // Sucesso
      setIsSuccess(true);
      notificationService.auth.forgotPasswordSuccess();
      
      return true;
      
    } catch (err) {
      console.error('Erro ao solicitar recuperação de senha:', err);
      
      let errorMessage = 'Erro ao solicitar recuperação de senha';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 404) {
        errorMessage = 'Email não encontrado';
      } else if (err.response?.status === 429) {
        errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente.';
      }
      
      setError(errorMessage);
      notificationService.auth.forgotPasswordError();
      
      return false;
      
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setEmail('');
    setIsSuccess(false);
    setError(null);
  };

  return { email, setEmail, isLoading, isSuccess, error, handlePasswordReset, resetState };
}
