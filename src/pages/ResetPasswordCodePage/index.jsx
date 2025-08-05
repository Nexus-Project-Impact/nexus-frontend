import React from 'react';
import { ResetPasswordCodeForm } from './components/ResetPasswordCodeForm';
import styles from './ResetPasswordCode.module.css';

const resetPasswordPageStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '30px 0',
  width: '100%',
  minHeight: '80vh'
};

function ResetPasswordCodePage() {
  return (
    <div style={resetPasswordPageStyles}>
      <ResetPasswordCodeForm />
    </div>
  );
}

export default ResetPasswordCodePage;
