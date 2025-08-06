

import React, { useState } from 'react';
import { useLogin } from '../../hooks/useLogin'; // Verifique se o caminho do import está correto
import { LoginForm } from './components/LoginForm';
import { RegisterModal } from '../../components/RegisterModal';
import { ForgotPasswordModal } from '../../components/ForgotPasswordModal';
import styles from './login.module.css';

// Estilos para centralizar o formulário na área de conteúdo do Layout
const loginPageStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  // O padding-top do Layout já cuida do espaço do Header, mas podemos adicionar mais se necessário
  padding: '30px 0', 
  width: '100%' ,
};

function LoginPage() {
  // A lógica do login continua aqui, no hook
  const loginProps = useLogin();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPassOpen, setIsForgotPassOpen] = useState(false);
  // O componente agora só se preocupa em renderizar o seu próprio conteúdo.
  // O Header e o Footer são adicionados automaticamente pelo <Layout />.
  return (
    <div className={styles.pageWrapper}>
      <LoginForm {...loginProps} 
      onRegisterClick={() => setIsRegisterOpen(true)} 
      onForgotPassClick={() => setIsForgotPassOpen(true)}/>
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
      <ForgotPasswordModal isOpen={isForgotPassOpen} onClose={() => setIsForgotPassOpen(false)} />
    </div>
  );
}

export default LoginPage;