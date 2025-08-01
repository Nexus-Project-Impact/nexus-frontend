import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import styles from './AdminLayout.module.css';
import nexusLogo from '../../assets/logo-white.png'; // Reutilizando o logo pequeno

export function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/admin/pacotes">
          <img src={nexusLogo} alt="Nexus Logo" className={styles.logo} />
        </Link>
          <nav>
            <ul className={styles.navList}>
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
                  to="/admin/metricas"
                  className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
                >
                  Metricas
                </NavLink>
                </li>
                <li>
                <NavLink 
                  to="/admin/comentarios"
                  className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
                >
                  Comentários
                </NavLink>
              </li>
            </ul>
          </nav>

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