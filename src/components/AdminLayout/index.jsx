import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import styles from './AdminLayout.module.css';
import nexusLogo from '../../assets/nexus-logo-white.png'; // Reutilizando o logo pequeno

export function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Link to="/admin/pacotes">
            <img src={nexusLogo} alt="Nexus Logo" className={styles.logo} />
          </Link>
          <button className={styles.hamburgerButton} onClick={() => setMenuOpen((v) => !v)} aria-label="Abrir menu">
            <span className={styles.hamburgerIcon}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
        <nav className={menuOpen ? `${styles.navMobile} ${styles.open}` : styles.navMobile}>
          <ul className={styles.navList} onClick={() => setMenuOpen(false)}>
            <li>
              <NavLink 
                to="/admin/pacotes"
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
              >
                Pacotes
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/reservas"
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
              >
                Reservas
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/avaliacoes"
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
              >
                Avaliações
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/metricas"
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
              >
                Metricas
              </NavLink>
            </li>
            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </li>
          </ul>
        </nav>
      </header>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        ©{new Date().getFullYear()} Nexus - Área do Colaborador
      </footer>
    </div>
  );
}