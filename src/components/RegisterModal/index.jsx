import React from 'react';
import { useRegister } from '../../hooks/useRegister';
import { formatPhone, formatCpf } from '../../utils/formatters';
import styles from './RegisterModal.module.css';

export function RegisterModal({ isOpen, onClose }) {
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    phone, setPhone,
    cpf, setCpf,
    error,
    isLoading,
    success,
    fieldErrors,
    handleRegister
  } = useRegister();
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('');

  // Validação de confirmação de senha
  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (value && password && value !== password) {
      setConfirmPasswordError('As senhas não conferem');
    } else {
      setConfirmPasswordError('');
    }
  };

  if (!isOpen) {
    return null;
  }

  // handleRegister já faz a validação de senha internamente
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        {success ? (
          <div className={styles.successMessage}>
            <h2>Cadastro realizado com sucesso!</h2>
            <p>Você já pode fazer o login.</p>
            <button onClick={onClose} className={styles.submitButton}>Fechar</button>
          </div>
        ) : (
          <form onSubmit={e => {
            e.preventDefault();
            if (password !== confirmPassword) {
              setConfirmPasswordError('As senhas não conferem!');
              return;
            }
            handleRegister(e);
          }}>
            <h2>Cadastre-se</h2>
            
            <div className={styles.inputGroup}>
              <input 
                name="name" 
                type="text" 
                placeholder="Nome Completo" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                disabled={isLoading}
                className={fieldErrors.name ? styles.inputError : ''}
              />
              {fieldErrors.name && <span className={styles.fieldError}>{fieldErrors.name}</span>}
            </div>

            <div className={styles.inputGroup}>
              <input 
                name="phone" 
                type="tel" 
                placeholder="Telefone (11) 99999-9999" 
                value={phone} 
                onChange={e => setPhone(formatPhone(e.target.value))} 
                required 
                disabled={isLoading}
                className={fieldErrors.phone ? styles.inputError : ''}
              />
              {fieldErrors.phone && <span className={styles.fieldError}>{fieldErrors.phone}</span>}
            </div>

            <div className={styles.inputGroup}>
              <input 
                name="cpf" 
                type="text" 
                placeholder="CPF 000.000.000-00" 
                value={cpf} 
                onChange={e => setCpf(formatCpf(e.target.value))} 
                required 
                disabled={isLoading}
                className={fieldErrors.cpf ? styles.inputError : ''}
              />
              {fieldErrors.cpf && <span className={styles.fieldError}>{fieldErrors.cpf}</span>}
            </div>

            <div className={styles.inputGroup}>
              <input 
                name="email" 
                type="email" 
                placeholder="E-mail" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                disabled={isLoading}
                className={fieldErrors.email ? styles.inputError : ''}
              />
              {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
            </div>

            <div className={styles.inputGroup}>
              <input 
                name="password" 
                type="password" 
                placeholder="Senha (min. 6 caracteres)" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                disabled={isLoading}
                className={fieldErrors.password ? styles.inputError : ''}
              />
              {fieldErrors.password && <span className={styles.fieldError}>{fieldErrors.password}</span>}
            </div>

            <div className={styles.inputGroup}>
              <input 
                name="confirmPassword" 
                type="password" 
                placeholder="Confirmar Senha" 
                value={confirmPassword} 
                onChange={e => handleConfirmPasswordChange(e.target.value)} 
                required 
                disabled={isLoading}
                className={confirmPasswordError ? styles.inputError : ''}
              />
              {confirmPasswordError && <span className={styles.fieldError}>{confirmPasswordError}</span>}
            </div>

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastre-se'}
            </button>
            {error && <p className={styles.errorText}>{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}