// src/hooks/useLogin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { saveToken } from '../utils/jwt'; // Função para salvar o token
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import api from '../services/api'; // Ajuste o caminho conforme necessário

export function useLogin() {
  const dispatch = useDispatch();
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
        dispatch(setCredentials({ user: {}, token: data.token })); // user vazio por enquanto
        navigate('/pacotes'); // Redireciona para a página de pacotes
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