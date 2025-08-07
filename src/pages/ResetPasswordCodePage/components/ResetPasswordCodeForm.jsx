import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaKey, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { resetPasswordWithCode } from '../../../services/authService';
import styles from '../ResetPasswordCode.module.css';
import nexusLogo from '../../../assets/nexus-logo.png';

export function ResetPasswordCodeForm() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Formulário de código enviado:', { email, code, newPassword, confirmPassword });
    
    setIsLoading(true);
    setError('');
    
    // Validações
    if (!email?.trim()) {
      setError('Email é obrigatório');
      setIsLoading(false);
      return;
    }
    
    if (!code?.trim() || code.length !== 6) {
      setError('Código deve ter 6 dígitos');
      setIsLoading(false);
      return;
    }
    
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
      // Usar função real do authService
      console.log('Enviando para API:', { email, code, newPassword });
      
      await resetPasswordWithCode(email, code, newPassword);
      
      // Sucesso
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Erro:', err);
      let errorMessage = 'Erro ao redefinir senha. Verifique se o código está correto.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = 'Código inválido ou expirado';
      } else if (err.response?.status === 404) {
        errorMessage = 'Email não encontrado';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <img src={nexusLogo} alt="Nexus Logo" className={styles.logo} />
        <div className={styles.successMessage}>
          <FaCheckCircle size={48} style={{ color: '#2ed573', marginBottom: '15px' }} />
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
        <p>Digite o código de 6 dígitos enviado para seu email e sua nova senha:</p>
        
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <FaEnvelope className={styles.inputIcon} />
            <input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <FaKey className={styles.inputIcon} />
            <input
              type="text"
              placeholder="Código de 6 dígitos"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              disabled={isLoading}
              className={styles.codeInput}
            />
          </div>
        </div>
        
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <FaLock className={styles.inputIcon} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <FaLock className={styles.inputIcon} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? (
            <span className={styles.loadingContent}>
              <span className={styles.spinner}></span>
              Redefinindo...
            </span>
          ) : (
            'Redefinir Senha'
          )}
        </button>
        
        {error && <p className={styles.errorText}>{error}</p>}
      </form>
    </div>
  );
