import { toast } from 'react-toastify';

// Serviço para padronizar notificações na aplicação
export const notificationService = {
  // Notificação de sucesso
  success: (message, options = {}) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Notificação de erro
  error: (message, options = {}) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Notificação de aviso
  warning: (message, options = {}) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Notificação de informação
  info: (message, options = {}) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Notificação personalizada
  custom: (message, options = {}) => {
    toast(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Notificações específicas para ações do sistema
  auth: {
    loginRequired: () => {
      toast.warning("Você precisa estar logado para continuar. Redirecionando para o login...", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    
    loginSuccess: (userName) => {
      toast.success(`Bem-vindo(a), ${userName}!`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
    
    loginError: () => {
      toast.error("Usuário ou senha inválidos. Tente novamente.", {
        position: "top-right",
        autoClose: 4000,
      });
    },
    
    logoutSuccess: () => {
      toast.info("Você foi desconectado com sucesso!", {
        position: "top-right",
        autoClose: 2000,
      });
    },
    
    registerSuccess: () => {
      toast.success("Cadastro realizado com sucesso! Bem-vindo(a)! 🎉", {
        position: "top-center",
        autoClose: 4000,
      });
    },
    
    registerError: () => {
      toast.error("Erro ao realizar cadastro. Verifique os dados e tente novamente.", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  },

  booking: {
    purchaseLoginRequired: () => {
      toast.warning("Você precisa estar logado para comprar um pacote. Redirecionando para o login...", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    
    purchaseSuccess: () => {
      toast.success("Compra realizada com sucesso! 🎉", {
        position: "top-center",
        autoClose: 5000,
      });
    },
    
    purchaseError: () => {
      toast.error("Erro ao processar pagamento. Tente novamente.", {
        position: "top-right",
        autoClose: 4000,
      });
    },
    
    pixCreated: () => {
      toast.success("PIX gerado com sucesso! 💚 Escaneie o QR Code ou copie o código para pagar.", {
        position: "top-center",
        autoClose: 6000,
      });
    },
    
    boletoCreated: () => {
      toast.success("Boleto gerado com sucesso! 📄 Use o código de barras para pagar no seu banco.", {
        position: "top-center",
        autoClose: 6000,
      });
    },
    
    copied: () => {
      toast.info("Código copiado para a área de transferência! 📋", {
        position: "bottom-right",
        autoClose: 2000,
      });
    },
    
    addToCart: (packageName) => {
      toast.success(`${packageName} foi adicionado ao carrinho!`, {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  },

  review: {
    createSuccess: () => {
      toast.success("Avaliação enviada com sucesso! Obrigado pelo seu feedback! ⭐", {
        position: "top-center",
        autoClose: 4000,
      });
    },
    
    createError: (message) => {
      toast.error(message || "Erro ao enviar avaliação. Tente novamente.", {
        position: "top-right",
        autoClose: 4000,
      });
    },
    
    submitSuccess: () => {
      toast.success("Avaliação enviada com sucesso! Obrigado pelo seu feedback! ⭐", {
        position: "top-center",
        autoClose: 4000,
      });
    },
    
    updateSuccess: () => {
      toast.success("Avaliação atualizada com sucesso!", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    
    deleteSuccess: () => {
      toast.info("Avaliação removida com sucesso.", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    
    deleteError: () => {
      toast.error("Erro ao excluir avaliação. Tente novamente.", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  }
};

export default notificationService;
