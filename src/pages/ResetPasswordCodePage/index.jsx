import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResetPasswordCodeForm } from './components/ResetPasswordCodeForm';
import { isAuthenticated } from '../../services/authService';
import styles from './ResetPasswordCode.module.css';

function ResetPasswordCodePage() {
  const navigate = useNavigate();

  useEffect(() => {
    
    if (isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

 
  if (isAuthenticated()) {
    return null;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.backgroundDecoration}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
        <div className={styles.circle4}></div>
        <div className={styles.circle5}></div>
      </div>
      <ResetPasswordCodeForm />
    </div>
  );
}

export default ResetPasswordCodePage;
