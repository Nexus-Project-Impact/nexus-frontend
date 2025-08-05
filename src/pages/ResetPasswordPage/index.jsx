import React from 'react';
import { useParams } from 'react-router-dom';
import { ResetPasswordForm } from './components/ResetPasswordForm';
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
  // Pegar o token da URL
  const { token } = useParams();

  return (
    <div style={resetPasswordPageStyles}>
      <ResetPasswordForm token={token} />
    </div>
  );
}

export default ResetPasswordPage;
