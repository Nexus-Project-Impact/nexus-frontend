import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice'; // Precisamos criar essa ação no slice
import styles from './Header.module.css';
import nexusLogo from '../../assets/nexus-logo.png'; // Usando o logo que já temos

export function Header({ onRegisterClick }) {
  // Acessa o estado de autenticação do Redux
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Despacha a ação de logout (que vamos criar)
    dispatch(logout());
    // Redireciona para a página de login
    navigate('/login');
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
            {token ? (
              // Links para quando o usuário ESTÁ logado
              <>
                <li>
                  <span className={styles.welcome}>Olá, {user?.name}!</span>
                </li>
                <li>
                  <button onClick={handleLogout} className={styles.logoutButton}>
                    Sair
                  </button>
                </li>
              </>
            ) : (
              // Links para quando o usuário NÃO ESTÁ logado
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