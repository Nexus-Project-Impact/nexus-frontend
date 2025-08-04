import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

// Usaremos uma versão simplificada do logo pequeno do header
import logoPequeno from '../../assets/logo-pequeno.png'; 

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <img src={logoPequeno} alt="Nexus" className={styles.logo} />
        </div>
        <div className={styles.links}>
          <Link to="/privacidade">Privacidade</Link>
          <Link to="/termos">Termos e Condições</Link>
        </div>
        <div className={styles.copyright}>
          <span>©{currentYear} Nexus</span>
        </div>
      </div>
    </footer>
  );
}