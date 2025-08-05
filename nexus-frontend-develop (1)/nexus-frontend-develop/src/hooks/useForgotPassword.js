import { useState } from 'react';
import { forgotPassword } from '../services/authService';

export function useForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    console.log('Botão Recuperar Senha clicado!', { email });
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    if (!email?.trim()) {
      console.log('Email vazio, mostrando erro');
      setError('Email é obrigatório');
      setIsLoading(false);
      return false;
    }

    try {
      console.log('Enviando email de recuperação para:', email.trim());
      const response = await forgotPassword(email.trim());
      
      console.log('Resposta do forgotPassword:', response);

      console.log('Email de recuperação enviado com sucesso');
      setIsSuccess(true);
      
      return {
        success: true,
        message: response.message || 'Email de recuperação enviado',
        email: email.trim()
      };
      
    } catch (err) {
      console.error('Erro no handlePasswordReset:', err);
      setError('Erro ao solicitar recuperação de senha');
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

  return { 
    email, 
    setEmail, 
    isLoading, 
    isSuccess, 
    error, 
    handlePasswordReset, 
    resetState
  };
}