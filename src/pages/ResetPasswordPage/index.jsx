import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResetPasswordForm } from './components/ResetPasswordForm';
import { isAuthenticated } from '../../services/authService';
import styles from './ResetPassword.module.css';

const resetPasswordPageStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '30px 0',
  width: '100%',
  minHeight: '80vh'
};

function ResetPasswordPage() {
  const navigate = useNavigate();
  
  const { token } = useParams();

  useEffect(() => {
   
    if (isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);


  if (isAuthenticated()) {
    return null;
  }

  return (
    <div style={resetPasswordPageStyles}>
      <ResetPasswordForm token={token} />
    </div>
  );
}

export default ResetPasswordPage;
