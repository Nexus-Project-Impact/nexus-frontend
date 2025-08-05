// Hook para lógica de login de usuário
// controla apenas login de usuário e verificações de autenticação

// imports e dependencias 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, isAuthenticated, getUserFromToken, getToken } from '../services/authService';
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
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setIsLoading(true); 
    setError(''); 
    
    // Validação básica
    if (!email.trim() || !password.trim()) {
      setError('Email e senha são obrigatórios');
      setIsLoading(false);
      return;
    }
    
    try {
     
      const data = await login(email.trim(), password);
      console.log('Login realizado com sucesso:', data);
      
      if (data.token) {
        
        const user = getUserFromToken();
        
        if (user) {
          dispatch(setCredentials({ user, token: data.token }));
          notificationService.auth.loginSuccess(user.name);
          navigate('/pacotes'); // Redireciona para a página de pacotes
        } else {
          setError('Erro ao processar dados do usuário');
          notificationService.auth.loginError();
        }
      } else {
        setError('Resposta inválida do servidor');
        notificationService.auth.loginError();
      }
    } catch (err) {
      console.error('Erro no login:', err);
      
      let errorMessage = 'Usuário ou senha inválidos';
      
      // Tratamento de erros específicos do backend
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorMessage = 'Email ou senha incorretos';
      } else if (err.response?.status === 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente.';
      }
      
      setError(errorMessage);
      notificationService.auth.loginError();
    } finally {
      setIsLoading(false); 
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
    
      await logout();
      
      dispatch(clearCredentials());

      notificationService.auth.logoutSuccess();
      
      // Redirecionar para página de login
      navigate('/login');
      
    } catch (err) {
      console.error('Erro no logout:', err);
      
      dispatch(clearCredentials());
      navigate('/login');
      
      notificationService.auth.logoutError();
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthStatus = () => {
    return isAuthenticated();
  };

  const getCurrentUser = () => {
    return getUserFromToken();
  };

  const getCurrentToken = () => {
    return getToken();
  };

  // LIMPAR CAMPOS DE LOGIN
  const clearAllFields = () => {
    setEmail('');
    setPassword('');
    setError('');
  };

  return { 
    // Estados de campos
    email, setEmail, 
    password, setPassword,
    
    // Estados de controle
    isLoading, 
    error, setError,
    
    // Funções de autenticação
    handleLogin,
    
    // Funções auxiliares
    checkAuthStatus,
    getCurrentUser,
    getCurrentToken,
    clearAllFields
  };
}