import { useState } from 'react';
import  api  from '../../../services/api';

export function useRegister() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

      const handleRegister = async (event) => {
      event.preventDefault();
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      // Validação simples que continua no frontend
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem.');
        setIsLoading(false);
        return;
      }

      // --- SIMULAÇÃO DO BACKEND ---
      console.log('Dados que seriam enviados para o backend:', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      });

      // Simula o tempo de espera da API
      setTimeout(() => {
        setIsSuccess(true); // Diz ao nosso componente que o cadastro foi um sucesso
        setIsLoading(false);
      }, 1000); // Espera 1 segundo
    };

  return { formData, error, isLoading, isSuccess, handleChange, handleRegister };
}