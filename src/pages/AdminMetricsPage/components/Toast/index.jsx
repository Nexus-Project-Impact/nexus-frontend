import React, { useEffect } from 'react';
import { FiX, FiAlertTriangle } from 'react-icons/fi';
import styles from './Toast.module.css';

export function Toast({ message, isVisible, onClose, type = 'error', duration = 4000 }) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.content}>
        <FiAlertTriangle className={styles.icon} />
        <span className={styles.message}>{message}</span>
      </div>
      <button className={styles.closeButton} onClick={onClose}>
        <FiX size={16} />
      </button>
    </div>
  );
}
