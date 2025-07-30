import React from 'react';
import { useSelector } from 'react-redux';
import styles from './PerfilPage.module.css';

export default function PerfilPage() {
  const user = useSelector(state => state.auth.user);

  if (!user) {
    return <div className={styles.container}><h2>Você precisa estar logado para ver seu perfil.</h2></div>;
  }

  const navigate = window.location ? (path) => window.location.href = path : () => {};
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <h2>Meu Perfil</h2>
      <div className={styles.infoBox}>
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Telefone:</strong> {user.phone}</p>
        <p><strong>CPF:</strong> {user.cpf}</p>
      </div>
      <div className={styles.menuBox}>
        <button className={styles.menuButton} onClick={() => navigate('/reservas')}>Minhas Reservas</button>
        <button className={styles.menuButton} onClick={() => navigate('/avaliacoes')}>Minhas Avaliações</button>
        <button className={styles.menuButton} onClick={handleLogout}>Sair</button>
      </div>
    </div>
  );
}
