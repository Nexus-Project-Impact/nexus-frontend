import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { setCredentials } from '../store/authSlice'; 

export function useLogin() {
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

    const MOCK_USER = { email: 'test@nexus.com', password: '123456' };

    setTimeout(() => {
      if (email === MOCK_USER.email && password === MOCK_USER.password) {
        const fakeUser = { id: 1, name: 'Bill Gates' };
        const fakeToken = 'token-secreto-mockado-para-frontend';
        
        // Salva no localStorage para persistência
        localStorage.setItem('@app-token', fakeToken);
        localStorage.setItem('@app-user', JSON.stringify(fakeUser));
        

        // Isso vai atualizar o estado global e fazer o Header reagir.
        dispatch(setCredentials({ user: fakeUser, token: fakeToken }));
        
        // Redireciona para a página de pacotes
        //navigate('/pacotes');
        navigate('/pacotes');

      } else {
        setError('E-mail ou senha inválidos.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return { email, setEmail, password, setPassword, error, isLoading, handleLogin };
}