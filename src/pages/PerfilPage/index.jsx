import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import styles from './PerfilPage.module.css';
import profileIcon from '../../assets/profile_circle_icon_242774.png';

export default function PerfilPage() {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) {
    return <div className={styles.container}><h2>Você precisa estar logado para ver seu perfil.</h2></div>;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className={styles.profileBox}>
      <img src={profileIcon} alt="Perfil" className={styles.profileIcon} />
      <h2 className={styles.userName}>{user.name || 'Nome de Usuário'}</h2>
      <div className={styles.buttonGroup}>
        <button className={styles.menuButton} onClick={() => navigate('/reservas')}>Minhas Reservas</button>
        <button className={styles.menuButton} onClick={handleLogout}>Sair</button>
      </div>
    </div>
  );
}
