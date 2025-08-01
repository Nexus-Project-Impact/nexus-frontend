// aqui estamos agrupando toda lógica de login em um só lugar
// ele controle o que acontece quando o usuário tenta fazer login

// imports e dependencias 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { saveToken } from '../utils/jwt'; // função para salvar o token
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice'; // guarda os dados do usuário e o token no Redux
import { notificationService } from '../services/notificationService';

// estados das consts
export function useLogin() {
  const dispatch = useDispatch(); // aqui é para enviar os dados para o redux
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // aqui é para mudar de página

  const handleLogin = async (e) => {
    e.preventDefault(); // impede o refresh da página
    setIsLoading(true); 
    setError(''); // limpa os erros anteriores
    try {
      // chamada à API
      const data = await login(email, password);
      if (data.token) {
        saveToken(data.token); // Salva o token JWT
        dispatch(setCredentials({ user: {}, token: data.token })); // user vazio por enquanto
        notificationService.auth.loginSuccess(email.split('@')[0]); // Pega parte antes do @ como nome
        navigate('/pacotes'); // Redireciona para a página de pacotes
      } else {
        setError('Usuário ou senha inválidos');
        notificationService.auth.loginError();
      }
    } catch (err) {
      setError('Usuário ou senha inválidos');
      notificationService.auth.loginError();
    }
    setIsLoading(false); // parar o carregamento
  };

  return { email, setEmail, password, setPassword, isLoading, error, handleLogin };
}