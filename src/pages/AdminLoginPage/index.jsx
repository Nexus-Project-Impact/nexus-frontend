import React from 'react';
import { useAdminLogin } from './hooks/useAdminLogin';
import styles from './AdminLoginPage.module.css';
import adminLogo from '../../assets/nexus-logo.png'; // Crie ou use um logo
import nexusIcon from '../../assets/logo-pequeno.png'; // Ícone do footer

export default function AdminLoginPage() {
  const { 
    email, setEmail, password, setPassword, 
    error, isLoading, handleLogin 
  } = useAdminLogin();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginCard}>
        <img src={adminLogo} alt="Nexus Área do Colaborador" className={styles.logo} />
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="E-mail" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <a href="#" className={styles.forgotPassword}>Esqueci a senha</a>
          <button type="submit" className={styles.loginButton} disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Login'}
          </button>
          {error && <p className={styles.errorText}>{error}</p>}
        </form>
      </div>
      <footer className={styles.footer}>
        <img src={nexusIcon} alt="Nexus" />
        <div className={styles.footerLinks}>
          <a href="#">Privacidade</a>
          <a href="#">Termos e Condições</a>
        </div>
        <span>©{new Date().getFullYear()} Nexus</span>
      </footer>
    </div>
  );
}