// DENTRO DE: src/components/Layout/index.jsx

import React, { useState } from 'react'; // 1. Importe useState
import { Outlet } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { RegisterModal } from '../RegisterModal'; // 2. Importe o RegisterModal
import styles from './Layout.module.css';

export function Layout() {
  // 3. Adicione o estado para controlar o modal aqui
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div className={styles.layout}>
      {/* 4. Passe a função para abrir o modal como prop para o Header */}
      <Header onRegisterClick={() => setIsRegisterModalOpen(true)} />
      
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      
      <Footer />

      {/* 5. Renderize o modal aqui, passando o estado e a função de fechar */}
      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
      />
    </div>
  );
}