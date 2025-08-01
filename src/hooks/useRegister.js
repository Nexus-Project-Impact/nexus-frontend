import { useState } from 'react';
import { register } from '../services/authService';
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

  const handleRegister = async (e) => {
    e.preventDefault(); // impedir da página recarregar
    setIsLoading(true);
    setError(''); // limpa os erros
    setSuccess(false); 
    try {
      const data = await register(name, email, password, phone, cpf);
      setSuccess(true); // Cadastro realizado com sucesso
      notificationService.auth.registerSuccess();
      // Você pode redirecionar ou fechar o modal aqui
    } catch (err) {
      setError('Erro ao cadastrar usuário');
      notificationService.auth.registerError();
    }
    setIsLoading(false);
  };

  return {
    name, setName,
    email, setEmail,
    password, setPassword,
    phone, setPhone,
    cpf, setCpf,
    isLoading, setIsLoading,
    error, setError,
    success, setSuccess,
    handleRegister
  };
}
