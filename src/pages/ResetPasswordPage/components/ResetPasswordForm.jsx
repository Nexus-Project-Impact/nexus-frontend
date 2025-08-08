import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPasswordWithToken } from '../../../services/authService';
import styles from '../ResetPassword.module.css';
import nexusLogo from '../../../assets/nexus-logo.png';

export function ResetPasswordForm({ token }) {
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  console.log('Token recebido:', token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Formulário enviado:', { newPassword, confirmPassword, token });
    
    setIsLoading(true);
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }
    
    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }
    
    try {
      // Usar a função real do authService
      console.log('Enviando para API:', { token, newPassword });
      
      await resetPasswordWithToken(token, newPassword);
      
      // Sucesso
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro ao redefinir senha. Verifique se o link ainda é válido.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <img src={nexusLogo} alt="Nexus Logo" className={styles.logo} />
        <div className={styles.successMessage}>
          <h2>Senha redefinida com sucesso!</h2>
          <p>Você será redirecionado para a página de login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <img src={nexusLogo} alt="Nexus Logo" className={styles.logo} />
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Redefinir Senha</h2>
        <p>Digite sua nova senha:</p>
        
        {token && (
          <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
            <small>Token: {token.substring(0, 20)}...</small>
          </div>
        )}
        
        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            disabled={isLoading}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            disabled={isLoading}
          />
        </div>
        
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
        </button>
        
        {error && <p className={styles.errorText}>{error}</p>}
      </form>
    </div>
  );
}
