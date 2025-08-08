import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice'; // Importe a ação de logout
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa'; // Ícones de perfil e menu
import { notificationService } from '../../services/notificationService';
import ThemeToggle from '../ThemeToggle';
import styles from './Header.module.css';
import nexusLogo from '../../assets/nexus-logo.png';

export function Header({ onRegisterClick }) {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    notificationService.auth.logoutSuccess();
    dispatch(logout()); // Despacha a ação para limpar o estado
    setTimeout(() => {
      navigate('/login'); // Redireciona para a página de login
    }, 1000);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/">
          <img src={nexusLogo} alt="Nexus Logo" className={styles.logo} />
        </NavLink>

        {/* Botão do menu hambúrguer - visível apenas em mobile */}
        <button className={styles.hamburgerButton} onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Menu de navegação */}
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <ul className={styles.navList}>
            <li>
              <NavLink 
                to="/pacotes"
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
                onClick={closeMenu}
              >
                Pacotes
              </NavLink>
            </li>
            
            {/* Theme Toggle */}
            <li className={styles.themeToggleItem}>
              <ThemeToggle compact={true} showLabel={false} />
            </li>

            {/* AQUI ESTÁ A LÓGICA CONDICIONAL */}
            {token ? (
              // Se EXISTE token, mostra só o link de perfil
              <>
                <li className={styles.profileMenu}>
                  <NavLink to="/perfil" className={styles.profileLink} onClick={closeMenu}>
                    {/* <FaUserCircle size={24} /> */}
                    <span>Perfil</span>
                  </NavLink>
                </li>
                <li className={styles.profileMenu}>
                  <NavLink 
                    to="/pacotes"
                    className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.profileLink}
                    onClick={closeMenu}
                  >
                    <span>Pacotes</span>
                  </NavLink>
                </li>
                <li className={styles.profileMenu}>
                  <NavLink to="/reservas" className={styles.profileLink} onClick={closeMenu}>
                    <span>Minhas Reservas</span>
                  </NavLink>
                </li>
              </>
            ) : (
              // Se NÃO EXISTE token, mostra a visão de "visitante"
              <>
                <li className={styles.profileMenu}>
                  <NavLink 
                    to="/pacotes"
                    className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.profileLink}
                    onClick={closeMenu}
                  >
                    <span>Pacotes</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
                    onClick={closeMenu}
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <button 
                    onClick={(e) => {
                      onRegisterClick(e);
                      closeMenu();
                    }} 
                    className={`${styles.navLink} ${styles.registerButton}`}
                  >
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