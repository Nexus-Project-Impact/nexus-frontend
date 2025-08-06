import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import reservationService from '../services/reservationService';
import { toast } from 'react-toastify';

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


// Hook para gerenciar reservas do usuário
export const useUserReservations = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar reservas do usuário
  const loadReservations = async () => {
    if (!user?.id || !token) {
      setReservations([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Tentando carregar reservas do usuário:', user.id);
      const data = await reservationService.getUserReservations();
      console.log('Reservas carregadas do backend:', data);
      
      // Processar os dados para garantir que tenham a estrutura esperada
      const processedReservations = data.map(reservation => ({
        id: reservation.id,
        packageId: reservation.packageId || reservation.travelPackageId,
        packageName: reservation.packageName || reservation.travelPackageName || 'Nome não disponível',
        packageImage: reservation.packageImage || reservation.image || 'https://via.placeholder.com/300x200',
        dates: reservation.dates || formatDates(reservation.departureDate, reservation.returnDate),
        travelers: reservation.travelers || [],
        totalAmount: reservation.totalAmount || reservation.totalPrice || 0,
        bookingDate: reservation.bookingDate || reservation.createdAt,
        status: reservation.status || 'confirmada',
        hasReview: reservation.hasReview || false
      }));
      
      setReservations(processedReservations);
    } catch (err) {
      console.error('Erro ao carregar reservas:', err);
      setError(`Erro ao carregar suas reservas: ${err.response?.data?.message || err.message}`);
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Função auxiliar para formatar datas
  const formatDates = (departureDate, returnDate) => {
    try {
      if (!departureDate) return 'Datas não disponíveis';
      
      const departure = new Date(departureDate);
      const returnD = returnDate ? new Date(returnDate) : null;
      
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      const departureStr = departure.toLocaleDateString('pt-BR', options);
      
      if (returnD) {
        const returnStr = returnD.toLocaleDateString('pt-BR', options);
        return `${departureStr} à ${returnStr}`;
      }
      
      return departureStr;
    } catch (error) {
      return 'Datas não disponíveis';
    }
  };

  // Cancelar reserva
  const cancelReservation = async (reservationId) => {
    try {
      await reservationService.cancel(reservationId);
      
      // Atualizar lista local
      setReservations(prev => 
        prev.map(reservation => 
          reservation.id === reservationId 
            ? { ...reservation, status: 'cancelada' }
            : reservation
        )
      );
      
      return { success: true };
    } catch (err) {
      console.error('Erro ao cancelar reserva:', err);
      return { success: false, error: err.message };
    }
  };

  // Marcar como avaliada
  const markAsReviewed = (reservationId) => {
    setReservations(prev => 
      prev.map(reservation => 
        reservation.id === reservationId 
          ? { ...reservation, hasReview: true }
          : reservation
      )
    );
  };

  // Verificar se pode avaliar
  const canReviewReservation = async (reservationId) => {
    try {
      const result = await reservationService.canReviewReservation(reservationId);
      return result.canReview;
    } catch (err) {
      console.error('Erro ao verificar se pode avaliar:', err);
      return true; // Em caso de erro, permite avaliar
    }
  };

  // Carregar dados quando o usuário ou token mudarem
  useEffect(() => {
    loadReservations();
  }, [user?.id, token]);

  return {
    reservations,
    isLoading,
    error,
    loadReservations,
    cancelReservation,
    markAsReviewed,
    canReviewReservation
  };
};
