import { useState } from 'react';

export function useErrorHandler() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsync = async (asyncFunction) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await asyncFunction();
      return result;
    } catch (err) {
      console.error('Error in useErrorHandler:', err);
      
      // Extrai mensagens de erro úteis
      let errorMessage = 'Ocorreu um erro inesperado';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        // Para erros de validação, pega o primeiro erro
        const firstError = Object.values(err.response.data.errors)[0];
        if (Array.isArray(firstError)) {
          errorMessage = firstError[0];
        } else {
          errorMessage = firstError;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err; // Re-throw para permitir tratamento específico no componente
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    error,
    isLoading,
    handleAsync,
    clearError
  };
}
