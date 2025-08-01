import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import styles from './AdminLayout.module.css';
import nexusLogo from '../../assets/logo-white.png'; // Reutilizando o logo pequeno

export function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/colaborador/login');
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/admin/pacotes">
          <img src={nexusLogo} alt="Nexus Logo" className={styles.logo} />
        </Link>
        <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
      </header>
      <main className={styles.mainContent}>
        <Outlet /> {/* As páginas de admin serão renderizadas aqui */}
      </main>
      <footer className={styles.footer}>
        ©{new Date().getFullYear()} Nexus - Área do Colaborador
      </footer>
    </div>
  );
}