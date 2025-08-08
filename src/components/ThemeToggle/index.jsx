import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle = ({ className = '', showLabel = true, compact = false, header = false }) => {
  const { toggleTheme, isDarkMode } = useTheme();

  const getClassName = () => {
    let baseClass = styles.themeToggle;
    if (compact) baseClass += ` ${styles.compact}`;
    if (header) baseClass += ` ${styles.header}`;
    if (className) baseClass += ` ${className}`;
    return baseClass;
  };

  return (
    <div className={getClassName()}>
      {showLabel && (
        <span className={styles.label}>
          {isDarkMode ? 'Modo Escuro' : 'Modo Claro'}
        </span>
      )}
      <button
        className={styles.toggleButton}
        onClick={toggleTheme}
        aria-label={`Alternar para modo ${isDarkMode ? 'claro' : 'escuro'}`}
        title={`Alternar para modo ${isDarkMode ? 'claro' : 'escuro'}`}
      >
        <div className={`${styles.toggleSlider} ${isDarkMode ? styles.dark : styles.light}`}>
          <div className={styles.toggleIcon}>
            {isDarkMode ? '🌙' : '☀️'}
          </div>
        </div>
      </button>
    </div>
  );
};

export default ThemeToggle;
