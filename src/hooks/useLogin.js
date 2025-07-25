// ARQUIVO: src/hooks/useLogin.js

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api'; // Corrigindo o caminho para o api.js

export function useLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event) => {
  event.preventDefault();
  setIsLoading(true);
  setError(null);

  // --- LÓGICA DE LOGIN MÁGICO ---
  const MOCK_USER = {
    email: 'test@nexus.com',
    password: '123456'
  };

  // Simula o tempo de espera da API
  setTimeout(() => {
    // Verifica se os dados batem com nosso usuário mockado
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      
      // Cria um usuário e token "falsos" para simular a resposta da API
      const fakeUser = { id: 1, name: 'Usuário Teste' };
      const fakeToken = 'token-secreto-mockado-para-frontend';
      
      // Salva os dados no localStorage, como faríamos com uma resposta real
      localStorage.setItem('@app-token', fakeToken);
      localStorage.setItem('@app-user', JSON.stringify(fakeUser));
      
      // Dispara a ação do Redux para atualizar o estado global
      // (Esta parte depende da sua implementação do Redux, mas a ideia é a mesma)
      // dispatch(loginSuccess({ user: fakeUser, token: fakeToken }));
      // Ou, se você não estiver usando Redux para isso, pode pular essa linha.

      // Redireciona para o painel de controle
      navigate('/dashboard'); // ou para a página de pacotes

    } else {
      // Se os dados não baterem, mostra um erro
      setError('E-mail ou senha inválidos.');
    }

    setIsLoading(false);
  }, 1000); // Espera 1 segundo
};

  return { email, setEmail, password, setPassword, error, isLoading, handleLogin };
}