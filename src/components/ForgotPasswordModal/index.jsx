import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import styles from './ForgotPasswordModal.module.css';
import nexusLogo from '../../assets/nexus-logo-white.png'; // Reutilizando o logo

export function ForgotPasswordModal({ isOpen, onClose }) {
  console.log('ForgotPasswordModal renderizado:', { isOpen });
  const navigate = useNavigate();
  
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

  // Função para ir para tela de redefinir senha
  const handleGoToResetPage = () => {
    onClose(); // Fecha o modal
    navigate('/reset-password'); // Navega para a página de redefinir senha
  };

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
              <h3>Código Enviado!</h3>
              <p>Verifique seu email. Você receberá um código de 6 dígitos para redefinir sua senha.</p>
              <button onClick={handleGoToResetPage} className={styles.actionButton}>
                Continuar para Redefinir Senha
              </button>
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
