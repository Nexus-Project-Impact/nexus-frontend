import React from 'react';
import { useRegister } from '../../hooks/useRegister';
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
    handleRegister
  } = useRegister();
  const [confirmPassword, setConfirmPassword] = React.useState('');

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
              setError('As senhas não conferem!');
              return;
            }
            handleRegister(e);
          }}>
            <h2>Cadastre-se</h2>
            <input name="name" type="text" placeholder="Nome Completo" value={name} onChange={e => setName(e.target.value)} required disabled={isLoading} />
            <input name="phone" type="tel" placeholder="Telefone" value={phone} onChange={e => setPhone(e.target.value)} required disabled={isLoading} />
            <input name="cpf" type="text" placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} required disabled={isLoading} />
            <input name="email" type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required disabled={isLoading} />
            <input name="password" type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required disabled={isLoading} />
            <input name="confirmPassword" type="password" placeholder="Confirmar Senha" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required disabled={isLoading} />
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