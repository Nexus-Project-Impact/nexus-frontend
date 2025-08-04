import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice'; // Importe a ação de logout
import { FaUserCircle } from 'react-icons/fa'; // Ícone de perfil
import { notificationService } from '../../services/notificationService';
import styles from './Header.module.css';
import nexusLogo from '../../assets/nexus-logo.png';

export function Header({ onRegisterClick }) {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    notificationService.auth.logoutSuccess();
    dispatch(logout()); // Despacha a ação para limpar o estado
    setTimeout(() => {
      navigate('/login'); // Redireciona para a página de login
    }, 1000);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/">
          <img src={nexusLogo} alt="Nexus Logo" className={styles.logo} />
        </NavLink>
        <nav>
          <ul className={styles.navList}>
            <li>
              <NavLink 
                to="/pacotes"
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
              >
                Pacotes
              </NavLink>
            </li>

            {/* AQUI ESTÁ A LÓGICA CONDICIONAL */}
            {token ? (
              // Se EXISTE token, mostra só o link de perfil
              <>
                <li className={styles.profileMenu}>
                  <NavLink to="/perfil" className={styles.profileLink}>
                    <FaUserCircle size={24} />
                    <span>Perfil</span>
                  </NavLink>
                </li>
              </>
            ) : (
              // Se NÃO EXISTE token, mostra a visão de "visitante"
              <>
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <button onClick={onRegisterClick} className={`${styles.navLink} ${styles.registerButton}`}>
                    Cadastre-se
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}