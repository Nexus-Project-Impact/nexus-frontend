import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './MyAccount.module.css';
import AccountService from '../../services/myAccountServce';

const MyAccount = () => {
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      setError('Usuário não autenticado');
      return;
    }
    
    const fetchAccountData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await AccountService.getAccountData();
        setUserData(response.data || response);
      } catch (error) {
        if (error.response?.status === 405) {
          setError('Método não permitido. Verifique a configuração da API.');
        } else if (error.response?.status === 401) {
          setError('Não autorizado. Faça login novamente.');
        } else if (error.response?.status === 404) {
          setError('Endpoint não encontrado. Verifique a URL da API.');
        } else {
          setError('Erro ao carregar dados da conta. Tente novamente.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchAccountData();
    }, 100);

    return () => clearTimeout(timer);
  }, [user]);

  const formatCPF = (cpf) => {
    if (!cpf) return 'Não informado';
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length === 11) {
      return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
  };

  const formatPhone = (phone) => {
    if (!phone) return 'Não informado';
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  const handleRefreshData = async () => {
    if (!user) {
      setError('Usuário não autenticado');
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await AccountService.getAccountData();
      setUserData(response.data || response);
    } catch (error) {
      if (error.response?.status === 405) {
        setError('Método não permitido. Verifique a configuração da API.');
      } else if (error.response?.status === 401) {
        setError('Não autorizado. Faça login novamente.');
      } else {
        setError('Erro ao recarregar dados da conta. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = () => {
    navigate('/trocar-senha');
  };

  const handleGoBack = () => {
    navigate('/perfil'); 
  };

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.loading}>
            Carregando dados da conta...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div>❌</div>
            <p>{error}</p>
            <button 
              className={styles.editButton}
              onClick={handleRefreshData}
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div>⚠️</div>
            <p>Dados da conta não encontrados</p>
            <button 
              className={styles.editButton}
              onClick={handleRefreshData}
            >
              Carregar Dados
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Minha Conta</h1>
        
        <div className={styles.profileCard}>
          <div className={styles.fieldsGrid}>
            {/* Campo Nome */}
            <div className={styles.fieldItem}>
              <label className={styles.fieldLabel}>
                <span className={styles.fieldIcon}>👤</span>
                Nome Completo
              </label>
              <div className={styles.fieldValue}>
                {userData.name || 'Não informado'}
              </div>
            </div>

            {/* Campo Email */}
            <div className={styles.fieldItem}>
              <label className={styles.fieldLabel}>
                <span className={styles.fieldIcon}>📧</span>
                Email
              </label>
              <div className={styles.fieldValue}>
                {userData.email || 'Não informado'}
              </div>
            </div>

            {/* Campo Telefone */}
            <div className={styles.fieldItem}>
              <label className={styles.fieldLabel}>
                <span className={styles.fieldIcon}>📱</span>
                Telefone
              </label>
              <div className={styles.fieldValue}>
                {formatPhone(userData.phone)}
              </div>
            </div>

            {/* Campo CPF */}
            <div className={`${styles.fieldItem} ${styles.cpfField}`}>
              <label className={styles.fieldLabel}>
                <span className={styles.fieldIcon}>🆔</span>
                CPF
              </label>
              <div className={styles.fieldValue}>
                {formatCPF(userData.cpf)}
              </div>
            </div>

            {/* Campo Senha */}
            <div className={styles.fieldItem}>
              <label className={styles.fieldLabel}>
                <span className={styles.fieldIcon}>🔒</span>
                Senha
              </label>
              <div className={styles.passwordField}>
                <span className={styles.passwordText}>
                  Senha oculta por segurança
                </span>
                <button 
                  className={styles.resetPasswordButton}
                  onClick={handleResetPassword}
                >
                  Redefinir Senha
                </button>
              </div>
            </div>
          </div>

          <div className={styles.actionSection}>
            <button 
              className={styles.backButton}
              onClick={handleGoBack}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;