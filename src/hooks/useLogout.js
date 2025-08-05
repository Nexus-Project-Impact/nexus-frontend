// Hook para lógica de logout
// controla logout de usuário e admin

// imports e dependencias 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import { useDispatch } from 'react-redux';
import { clearCredentials } from '../store/authSlice';
import { notificationService } from '../services/notificationService';

// estados das consts
export function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {

      await logout();
      
      dispatch(clearCredentials());

      notificationService.auth.logoutSuccess();
      
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

  return { 
    isLoading,
    
    handleLogout
  };
}
