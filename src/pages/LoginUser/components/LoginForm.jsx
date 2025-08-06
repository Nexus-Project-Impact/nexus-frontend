import React from 'react';
import styles from '../login.module.css';

// Importe suas imagens - vamos precisar delas!
import nexusLogo from '../../../assets/nexus-logo.png';
import beachImage from '../../../assets/beach-image.jpg';
import logoPequeno from '../../../assets/logo-pequeno.png';

export function LoginForm({
  handleLogin,
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  error,
  onRegisterClick,
  onForgotPassClick,
}) {
  return (
    <>
    <div className={styles.bodyContainer}>
      <div className={styles.imageSectionResponsive}>
        <img src={beachImage} alt="Praia" className={styles.beachImageResponsive} />
    </div>
    <div className={styles.loginContainer}>
      {/* Coluna da Esquerda com a Imagem */}
      <div className={styles.imageSection}>
        <img src={beachImage} alt="Praia" className={styles.beachImage} />
        <div className={styles.imageOverlay}>
          <img src={logoPequeno} alt="Nexus" className={styles.overlayLogo} />
          <span>Seu novo destino</span>
        </div>
      </div>

      {/* Coluna da Direita com o Formulário */}
      <form className={styles.formSection} onSubmit={handleLogin}>
        <img src={nexusLogo} alt="Nexus Logo" className={styles.mainLogo} />

        <div className={styles.inputGroup}>
          <label htmlFor="email">E-mail</label>
          <input
            placeholder="Digite seu e-mail"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required/>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            placeholder="Senha"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <button type="button" onClick={onForgotPassClick} className={styles.forgotPassword}>
          Esqueci a senha
        </button>

        <button type="submit" className={styles.loginButton} disabled={isLoading}>
          {isLoading ? 'Carregando...' : 'Login'}
        </button>

        <button type="button" onClick={onRegisterClick} className={styles.signupLink}>
        Cadastre-se
        </button>
        
        {error && <p className={styles.errorText}>{error}</p>}
      </form>
    </div>

    </div>
    </>
  );
}