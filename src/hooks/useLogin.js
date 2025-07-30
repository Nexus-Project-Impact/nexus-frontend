// src/hooks/useLogin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { saveToken } from '../utils/jwt'; // Função para salvar o token

export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      if (data.token) {
        saveToken(data.token); // Salva o token JWT
        navigate('/'); // Redireciona para a página inicial
      } else {
        setError('Usuário ou senha inválidos');
      }
    } catch (err) {
      setError('Usuário ou senha inválidos');
    }
    setIsLoading(false);
  };

  return { email, setEmail, password, setPassword, isLoading, error, handleLogin };
}