import api from './api';

// Serviço para gerenciar reservas
const reservationService = {
  // Buscar todas as reservas do usuário logado
  getUserReservations: async () => {
    try {
      const response = await api.get('/api/ReservationController/MyReservations');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar reservas do usuário:', error);
      throw error;
    }
  },

  // Buscar reserva por ID
  getById: async (reservationId) => {
    try {
      const response = await api.get(`/api/ReservationController/GetById/${reservationId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar reserva:', error);
      throw error;
    }
  },

  // Criar nova reserva
  create: async (reservationData) => {
    try {
      const response = await api.post('/api/ReservationController/Create', reservationData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      throw error;
    }
  },

  // Excluir reserva (apenas admin)
  delete: async (reservationId) => {
    try {
      const response = await api.delete(`/api/ReservationController/Delete/${reservationId}`);
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
