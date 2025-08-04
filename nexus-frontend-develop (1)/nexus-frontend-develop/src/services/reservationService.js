import api from './api';

// Serviço para gerenciar reservas
const reservationService = {
  // Buscar todas as reservas do usuário logado
  getUserReservations: async () => {
    try {
      const response = await api.get('/Reservation/MyReservations');
      
      // Se não há dados ou é null, retorna array vazio
      if (!response.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar reservas do usuário:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      
      // Se o erro for 404 (usuário sem reservas), retorna array vazio
      if (error.response?.status === 404) {
        return [];
      }
      
      // Para outros erros, relança a exceção
      throw error;
    }
  },

  // Buscar reserva por ID
  getById: async (reservationId) => {
    try {
      const response = await api.get(`/Reservation/GetById/${reservationId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar reserva:', error);
      throw error;
    }
  },

  // Criar nova reserva
  create: async (reservationData) => {
    try {
      const response = await api.post('/Reservation/Create', reservationData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      throw error;
    }
  },

  // Excluir reserva (apenas admin)
  delete: async (reservationId) => {
    try {
      const response = await api.delete(`/Reservation/Delete/${reservationId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir reserva:', error);
      throw error;
    }
  },

  // Verificar se usuário pode avaliar uma reserva específica
  canReviewReservation: async (reservationId) => {
    try {
      // Como não há endpoint específico para isso no backend, 
      // vamos buscar a reserva e verificar se ela está finalizada
      const reservation = await this.getById(reservationId);
      
      // Reserva pode ser avaliada se estiver finalizada
      const canReview = reservation.status === 'finalizada' || reservation.status === 'Finalizada';
      
      return { 
        canReview, 
        reason: canReview ? 'Pode avaliar' : 'Reserva ainda não finalizada' 
      };
    } catch (error) {
      console.error('Erro ao verificar se pode avaliar:', error);
      // Em caso de erro, permite avaliar
      return { canReview: true, reason: 'Verificação não disponível' };
    }
  }
};

export default reservationService;
