import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PasswordService from '../../services/passwordService';
import styles from './ChangePassword.module.css';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Verificar se o usuário está logado
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Limpar erro ao digitar
  };

  const validateForm = () => {
    if (!formData.currentPassword.trim()) {
      setError('Senha atual é obrigatória');
      return false;
    }
    
    if (!formData.newPassword.trim()) {
      setError('Nova senha é obrigatória');
      return false;
    }
    
    if (!formData.confirmPassword.trim()) {
      setError('Confirmação de senha é obrigatória');
      return false;
    }
    
    // Verificar se as senhas coincidem
    if (!PasswordService.passwordsMatch(formData.newPassword, formData.confirmPassword)) {
      setError('As senhas não coincidem');
      return false;
    }
    
    // Validar força da senha
    const passwordValidation = PasswordService.validatePasswordStrength(formData.newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]);
      return false;
    }
    
    if (formData.currentPassword === formData.newPassword) {
      setError('A nova senha deve ser diferente da senha atual');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await PasswordService.changePassword(
        formData.currentPassword,
        formData.newPassword
      );
      
      if (result.success) {
        setIsSuccess(true);
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          navigate('/minhaConta');
        }, 2000);
      } else {
        setError(result.message || 'Erro ao alterar senha');
      }
      
    } catch (err) {
      console.error('Erro ao alterar senha:', err);
      setError('Erro inesperado. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/minhaConta');
  };

  if (isSuccess) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✅</div>
            <h2>Senha alterada com sucesso!</h2>
            <p>Sua senha foi atualizada. Você será redirecionado para sua conta...</p>
            <div className={styles.loadingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.formCard}>
          <h1 className={styles.title}>Alterar Senha</h1>
          <p className={styles.subtitle}>
            Digite sua senha atual e escolha uma nova senha segura
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <div className={styles.errorMessage}>
                <span className={styles.errorIcon}>⚠️</span>
                {error}
              </div>
            )}

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <span className={styles.fieldIcon}>🔒</span>
                Senha Atual
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Digite sua senha atual"
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <span className={styles.fieldIcon}>🔑</span>
                Nova Senha
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Digite sua nova senha (mín. 6 caracteres)"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <span className={styles.fieldIcon}>🔑</span>
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Confirme sua nova senha"
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Alterando...
                  </>
                ) : (
                  'Alterar Senha'
                )}
              </button>

              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
