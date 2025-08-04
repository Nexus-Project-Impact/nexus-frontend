import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { setCredentials } from '../store/authSlice'; 

const MOCK_ADMIN = { 
  email: 'admin@nexus.com', 
  password: 'admin' 
};

export function useAdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
        const fakeAdminUser = { id: 99, name: 'Colaborador' };
        const fakeToken = 'token-secreto-mockado-para-admin';
        
        localStorage.setItem('@app-token', fakeToken);
        localStorage.setItem('@app-user', JSON.stringify(fakeAdminUser));
        dispatch(setCredentials({ user: fakeAdminUser, token: fakeToken }));
        
        navigate('/dashboard');
      } else {
        setError('Credenciais de colaborador inválidas.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return { email, setEmail, password, setPassword, error, isLoading, handleLogin };
}
