import React from 'react';
import { useRegister } from './hooks/useRegister';
import styles from './RegisterModal.module.css';

export function RegisterModal({ isOpen, onClose }) {
  const { formData, error, isLoading, isSuccess, handleChange, handleRegister } = useRegister();

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        {isSuccess ? (
          <div className={styles.successMessage}>
            <h2>Cadastro realizado com sucesso!</h2>
            <p>Você já pode fazer o login.</p>
            <button onClick={onClose} className={styles.submitButton}>Fechar</button>
          </div>
        ) : (
          <form onSubmit={handleRegister}>
            <h2>Cadastre-se</h2>
            
            <input name="name" type="text" placeholder="Nome Completo" onChange={handleChange} required disabled={isLoading} />
            <input name="phone" type="tel" placeholder="Telefone" onChange={handleChange} required disabled={isLoading} />
            <input name="email" type="email" placeholder="E-mail" onChange={handleChange} required disabled={isLoading} />
            <input name="password" type="password" placeholder="Senha" onChange={handleChange} required disabled={isLoading} />
            <input name="confirmPassword" type="password" placeholder="Confirmar Senha" onChange={handleChange} required disabled={isLoading} />

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