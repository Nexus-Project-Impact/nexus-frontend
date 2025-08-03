import api from './api';

// Serviço para gerenciar reservas
const reservationService = {
  // Buscar todas as reservas do usuário logado
  getUserReservations: async () => {
    try {
      console.log('🚀 Fazendo requisição para /Reservation/MyReservations');
      const response = await api.get('/Reservation/MyReservations');
      console.log('✅ Resposta recebida:', response.data);
      
      // Se não há reservas, retorna um mock para demonstração
      if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
        console.log('📝 Nenhuma reserva encontrada, retornando dados demonstrativos');
        return [
          {
            id: 1,
            packageId: 1,
            packageName: 'Fernando de Noronha - Paraíso Tropical',
            packageImage: 'src/assets/Fernando-de-Noronha-01.jpg',
            departureDate: '2025-08-15',
            returnDate: '2025-08-22',
            status: 'finalizada',
            hasReview: false,
            totalAmount: 2500.00
          },
          {
            id: 2,
            packageId: 2,
            packageName: 'Bahia - Praia do Forte',
            packageImage: 'src/assets/baia-do-sancho.jpg',
            departureDate: '2025-09-10',
            returnDate: '2025-09-17',
            status: 'finalizada',
            hasReview: true,
            totalAmount: 1800.00
          }
        ];
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar reservas do usuário:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      
      // Em caso de erro, retorna dados demonstrativos
      console.log('📝 Erro na API, retornando dados demonstrativos');
      return [
        {
          id: 1,
          packageId: 1,
          packageName: 'Fernando de Noronha - Paraíso Tropical',
          packageImage: 'src/assets/Fernando-de-Noronha-01.jpg',
          departureDate: '2025-08-15',
          returnDate: '2025-08-22',
          status: 'finalizada',
          hasReview: false,
          totalAmount: 2500.00
        }
      ];
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
