import { useState } from 'react';
import { forgotPassword } from '../services/authService';

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
      
      await forgotPassword(email.trim());
      

      setIsSuccess(true);
      return true;
      
    } catch (err) {
      
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

  return { email, setEmail, isLoading, isSuccess, error, handlePasswordReset, resetState };
}