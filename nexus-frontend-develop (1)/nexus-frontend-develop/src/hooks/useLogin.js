// aqui estamos agrupando toda lógica de autenticação em um só lugar
// controla login, logout, registro, forgot password e verificações

// imports e dependencias 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, login_admin, logout, forgotPassword, resetPassword, register, isAuthenticated, getUserFromToken, getToken } from '../services/authService';
import { useDispatch } from 'react-redux';
import { setCredentials, clearCredentials } from '../store/authSlice'; // guarda os dados do usuário e o token no Redux
import { notificationService } from '../services/notificationService';

// estados das consts
export function useLogin() {
  const dispatch = useDispatch(); // aqui é para enviar os dados para o redux
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  
  // Estados para registro
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  
  const navigate = useNavigate(); // aqui é para mudar de página

  const handleLogin = async (e) => {
    e.preventDefault(); // impede o refresh da página
    setIsLoading(true); 
    setError(''); // limpa os erros anteriores
    
    // Validação básica
    if (!email.trim() || !password.trim()) {
      setError('Email e senha são obrigatórios');
      setIsLoading(false);
      return;
    }
    
    try {
      // chamada à API - authService já salva o token automaticamente
      const data = await login(email.trim(), password);
      console.log('Login realizado com sucesso:', data);
      
      if (data.token) {
        // Usar função do authService para extrair dados do token
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
      setIsLoading(false); // parar o carregamento
    }
  };

  // LOGIN ADMIN: login específico para administradores
  const handleLoginAdmin = async (e) => {
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
      // chamada à API de login admin - authService já salva o token automaticamente
      const data = await login_admin(email.trim(), password);
      console.log('Login admin realizado com sucesso:', data);
      
      if (data.token) {
        // Usar função do authService para extrair dados do token
        const user = getUserFromToken();
        
        if (user) {
          dispatch(setCredentials({ user, token: data.token }));
          notificationService.auth.loginSuccess(user.name);
          navigate('/admin'); // Redireciona para página de admin
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
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorMessage = 'Acesso negado. Verifique suas credenciais de administrador.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Você não tem permissão de administrador.';
      }
      
      setError(errorMessage);
      notificationService.auth.loginError();
    } finally {
      setIsLoading(false);
    }
  };

  // REGISTRO: registrar novo usuário
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setRegisterSuccess(false);
    
    // Validação básica
    if (!name.trim() || !email.trim() || !password.trim() || !phone.trim() || !cpf.trim()) {
      setError('Todos os campos são obrigatórios');
      setIsLoading(false);
      return;
    }
    
    try {
      // Limpar telefone e CPF antes de enviar (apenas números)
      const cleanPhone = phone.replace(/\D/g, '');
      const cleanCpf = cpf.replace(/\D/g, '');
      
      // Registrar usuário
      const data = await register(name.trim(), email.trim(), password, cleanPhone, cleanCpf);
      setRegisterSuccess(true);
      notificationService.auth.registerSuccess();
      
      // Limpar formulário após sucesso
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setCpf('');
      
    } catch (err) {
      console.error('Erro no registro:', err);
      
      let errorMessage = 'Erro ao cadastrar usuário';
      
      if (err.response?.data?.errors) {
        // Mapear erros do backend
        const backendErrors = err.response.data.errors;
        const firstError = Object.values(backendErrors)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      notificationService.auth.registerError();
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

  const handleForgotPassword = async (emailForReset) => {
    setIsLoading(true);
    setError('');
    setForgotPasswordSuccess(false);
    
    // Validação básica do email
    if (!emailForReset?.trim()) {
      setError('Email é obrigatório');
      setIsLoading(false);
      return false;
    }
    
    try {
      // Chamar forgotPassword do authService
      await forgotPassword(emailForReset.trim());
      
      // Sucesso
      setForgotPasswordSuccess(true);
      notificationService.auth.forgotPasswordSuccess();
      
      return true;
      
    } catch (err) {
      console.error('Erro ao solicitar recuperação de senha:', err);
      
      let errorMessage = 'Erro ao solicitar recuperação de senha';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 404) {
        errorMessage = 'Email não encontrado';
      } else if (err.response?.status === 429) {
        errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente.';
      }
      
      setError(errorMessage);
      notificationService.auth.forgotPasswordError();
      
      return false;
      
    } finally {
      setIsLoading(false);
    }
  };

  // RESETAR SENHA: redefine senha do usuário logado (REQUER AUTORIZAÇÃO)
  const handleResetPassword = async (currentPassword, newPassword, confirmPassword) => {
    setIsLoading(true);
    setError('');
    
    // Validações básicas
    if (!currentPassword?.trim()) {
      setError('Senha atual é obrigatória');
      setIsLoading(false);
      return false;
    }
    
    if (!newPassword?.trim()) {
      setError('Nova senha é obrigatória');
      setIsLoading(false);
      return false;
    }
    
    if (newPassword.length < 6) {
      setError('Nova senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return false;
    }
    
    if (confirmPassword && newPassword !== confirmPassword) {
      setError('Senhas não coincidem');
      setIsLoading(false);
      return false;
    }
    
    try {
      // Preparar objeto conforme modelo RequestResetPassword
      const requestResetPassword = {
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim()
      };
      
      await resetPassword(requestResetPassword);
      
      // Notificação de sucesso
      notificationService.success("Senha redefinida com sucesso!");
      
      return true;
      
    } catch (err) {
      console.error('Erro ao resetar senha:', err);
      
      let errorMessage = 'Erro ao redefinir senha';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = 'Senha atual incorreta';
      } else if (err.response?.status === 401) {
        errorMessage = 'Você precisa estar logado para redefinir a senha';
      } else if (err.response?.status === 422) {
        errorMessage = 'Dados inválidos para redefinição de senha';
      }
      
      setError(errorMessage);
      notificationService.error(errorMessage);
      
      return false;
      
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

  // LIMPAR TODOS OS CAMPOS
  const clearAllFields = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setCpf('');
    setError('');
    setForgotPasswordSuccess(false);
    setRegisterSuccess(false);
  };

  return { 
    // Estados de campos
    email, setEmail, 
    password, setPassword,
    name, setName,
    phone, setPhone,
    cpf, setCpf,
    
    // Estados de controle
    isLoading, 
    error, setError,
    forgotPasswordSuccess, setForgotPasswordSuccess,
    registerSuccess, setRegisterSuccess,
    
    // Funções de autenticação
    handleLogin,
    handleLoginAdmin,
    handleRegister,
    handleLogout,
    handleForgotPassword,
    handleResetPassword,
    
    // Funções auxiliares
    checkAuthStatus,
    getCurrentUser,
    getCurrentToken,
    clearAllFields
  };
}