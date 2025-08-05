import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { setCredentials } from '../store/authSlice';
import { login_admin, getUserFromToken } from '../services/authService';
import { notificationService } from '../services/notificationService';

export function useAdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validação básica
    if (!email.trim() || !password.trim()) {
      setError('Email e senha são obrigatórios');
      setIsLoading(false);
      return;
    }

    try {
      // Usar endpoint real do authService
      const data = await login_admin(email.trim(), password);
      console.log('Login admin realizado com sucesso:', data);
      
      if (data.token) {
        // Extrair dados do usuário do token
        const user = getUserFromToken();
        
        if (user) {
          // Verificar se o usuário tem permissão de admin
          const isAdmin = Array.isArray(user.roles) ? 
            user.roles.includes('Admin') : 
            user.roles === 'Admin';
            
          if (isAdmin) {
            dispatch(setCredentials({ user, token: data.token }));
            notificationService.auth.loginSuccess(user.name);
            navigate('/admin'); // Redirecionar para área admin
          } else {
            setError('Usuário não possui permissões de administrador');
            notificationService.auth.loginError();
          }
        } else {
          setError('Erro ao processar dados do usuário');
          notificationService.auth.loginError();
        }
      } else {
        setError('Resposta inválida do servidor');
        notificationService.auth.loginError();
      }
    } catch (err) {
      console.error('Erro no login admin:', err);
      
      let errorMessage = 'Credenciais de administrador inválidas';
      
      // Tratamento de erros específicos
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorMessage = 'Email ou senha incorretos';
      } else if (err.response?.status === 403) {
        errorMessage = 'Você não tem permissão de administrador';
      } else if (err.response?.status === 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente.';
      }
      
      setError(errorMessage);
      notificationService.auth.loginError();
    } finally {
      setIsLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, error, isLoading, handleLogin };
}
