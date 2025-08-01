import React, { useEffect } from 'react';
import { useForgotPassword } from './hooks/useForgotPassword';
import styles from './ForgotPasswordModal.module.css';
import nexusLogo from '../../assets/nexus-logo.png'; // Reutilizando o logo

export function ForgotPasswordModal({ isOpen, onClose }) {
  const { 
    email, setEmail, isLoading, isSuccess, 
    handlePasswordReset, resetState 
  } = useForgotPassword();

  // Reseta o estado do modal sempre que ele for fechado
  useEffect(() => {
    if (!isOpen) {
      setTimeout(resetState, 300); // Adiciona um pequeno delay
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Coluna da Esquerda (Laranja) */}
        <div className={styles.leftPanel}>
          <img src={nexusLogo} alt="Nexus Logo" />
        </div>

        {/* Coluna da Direita (Formulário) */}
        <div className={styles.rightPanel}>
          {isSuccess ? (
            <div className={styles.successView}>
              <h3>Link Enviado!</h3>
              <p>Verifique sua caixa de entrada (e a pasta de spam) para redefinir sua senha.</p>
              <button onClick={onClose} className={styles.actionButton}>Fechar</button>
            </div>
          ) : (
            <form onSubmit={handlePasswordReset}>
              <h3>Recuperar senha</h3>
              <p className={styles.instructions}>
                Digite seu e-mail que enviaremos um link para definir uma nova senha
              </p>
              <input 
                type="email" 
                placeholder="E-mail cadastrado" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className={styles.actionButton} disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Recuperar Senha'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}