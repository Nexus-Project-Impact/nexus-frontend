// Hook para lógica de redefinição de senha
// controla reset password para usuário logado (REQUER AUTORIZAÇÃO)

// imports e dependencias 
import { useState } from 'react';
import { resetPasswordLoggedUser } from '../services/authService';
import { notificationService } from '../services/notificationService';

export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async (currentPassword, newPassword, confirmPassword) => {
    setIsLoading(true);
    setError('');
    
    // Validações básicas
    if (!currentPassword?.trim()) {
      setError('Senha atual é obrigatória');
      setIsLoading(false);
      return false;
    }
    
    if (!newPassword?.trim()) {
      setError('Nova senha é obrigatória');
      setIsLoading(false);
      return false;
    }
    
    if (newPassword.length < 6) {
      setError('Nova senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return false;
    }
    
    if (confirmPassword && newPassword !== confirmPassword) {
      setError('Senhas não coincidem');
      setIsLoading(false);
      return false;
    }
    
    try {
      await resetPasswordLoggedUser(currentPassword.trim(), newPassword.trim());
      
      notificationService.success("Senha redefinida com sucesso!");
      
      return true;
      
    } catch (err) {
      console.error('Erro ao resetar senha:', err);
      
      let errorMessage = 'Erro ao redefinir senha';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = 'Senha atual incorreta';
      } else if (err.response?.status === 401) {
        errorMessage = 'Você precisa estar logado para redefinir a senha';
      } else if (err.response?.status === 422) {
        errorMessage = 'Dados inválidos para redefinição de senha';
      }
      
      setError(errorMessage);
      notificationService.error(errorMessage);
      
      return false;
      
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError('');
  };

  return { 
    isLoading, 
    error, 
    
    // Funções
    handleResetPassword,
    clearError
  };
}
