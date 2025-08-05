import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import packageService from '../services/packageService';
import { notificationService } from '../services/notificationService';

export function usePackageDelete() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const deletePackage = async (packageId, packageName = '') => {
    if (!packageId) {
      setError('ID do pacote é obrigatório');
      return false;
    }

    setIsLoading(true);
    setError('');

    try {

      await packageService.deletePackage(packageId);
      
      notificationService.success(`Pacote ${packageName ? `"${packageName}"` : ''} excluído com sucesso!`);
      
      return true;
      
    } catch (err) {
      console.error('Erro ao deletar pacote:', err);
      
      let errorMessage = 'Erro ao excluir pacote';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 404) {
        errorMessage = `Pacote com ID ${packageId} não foi encontrado para exclusão.`;
      } else if (err.response?.status === 401) {
        errorMessage = 'Você não tem permissão para excluir pacotes.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Acesso negado. Apenas administradores podem excluir pacotes.';
      } else if (err.response?.status === 500) {
       
        if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
          errorMessage = err.response.data.errors[0] || 'Erro interno do servidor';
        } else {
          errorMessage = 'Erro interno do servidor. Tente novamente.';
        }
      }
      
      setError(errorMessage);
      notificationService.error(errorMessage);
      
      return false;
      
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAndRedirect = async (packageId, packageName = '', redirectPath = '/admin') => {
    const success = await deletePackage(packageId, packageName);
    
    if (success) {
      
      navigate(redirectPath);
    }
    
    return success;
  };

  const clearError = () => {
    setError('');
  };

  return {

    isLoading,
    error,
    

    deletePackage,                   
    deleteAndRedirect,              
    

    clearError
  };
}
