import React, { useState, useEffect } from 'react';
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest(`.${styles.profileDropdown}`)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

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
            {/* AQUI ESTÁ A LÓGICA CONDICIONAL */}
            {token ? (
              // Se EXISTE token, mostra o link de pacotes e dropdown de perfil
              <>
                <li className={styles.profileMenu}>
                  <NavLink 
                    to="/pacotes"
                    className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
                    onClick={closeMenu}
                  >
                    <span>Pacotes</span>
                  </NavLink>
                </li>
                <li className={styles.profileDropdown}>
                  <button 
                    className={styles.profileButton}
                    onClick={toggleProfile}
                  >
                    <FaUserCircle size={24} />
                    <span>Perfil</span>
                  </button>
                  {isProfileOpen && (
                    <div className={styles.dropdownMenu}>
                      <NavLink 
                        to="/perfil" 
                        className={styles.dropdownItem}
                        onClick={() => {
                          closeProfile();
                          closeMenu();
                        }}
                      >
                        Meu Perfil
                      </NavLink>
                      <button 
                        className={styles.dropdownItem}
                        onClick={() => {
                          handleLogout();
                          closeProfile();
                          closeMenu();
                        }}
                      >
                        Sair
                      </button>
                    </div>
                  )}
                </li>
              </>
            ) : (
              // Se NÃO EXISTE token, mostra a visão de "visitante"
              <>
                <li className={styles.profileMenu}>
                  <NavLink 
                    to="/pacotes"
                    className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
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
            
            {/* Theme Toggle - movido para o final da lista */}
            <li className={styles.themeToggleItem}>
              <ThemeToggle compact={true} header={true} showLabel={false} />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}