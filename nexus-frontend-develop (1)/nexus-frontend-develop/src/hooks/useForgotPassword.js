import { useState } from 'react';

export function useForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handlePasswordReset = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    // Simulação de chamada de API
    console.log(`Simulando envio de link de recuperação para: ${email}`);
    
    setTimeout(() => {
      // Simplesmente damos sucesso para qualquer e-mail no nosso protótipo
      setIsSuccess(true);
      setIsLoading(false);
    }, 1500);
  };

  const resetState = () => {
    setEmail('');
    setIsSuccess(false);
    setError(null);
  };

  return { email, setEmail, isLoading, isSuccess, error, handlePasswordReset, resetState };
}