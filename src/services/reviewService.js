import api from './api';

// Serviço para gerenciar avaliações
export const reviewService = {
  // Buscar todas as avaliações (getAll)
  getAll: async () => {
    try {
      const response = await api.get('/Review/GetAllReviews');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar todas as avaliações:', error);
      
      // Se erro 404, retorna array vazio (não há reviews ainda)
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  // Buscar avaliações de um pacote específico
  getByPackageId: async (packageId) => {
    try {
      // Primeiro tenta buscar diretamente por packageId se houver endpoint específico
      try {
        const response = await api.get(`/Review/GetById/${packageId}`);
        return response.data;
      } catch (directError) {
        // Se não houver endpoint específico, usa getAll e filtra
        const response = await api.get('/Review/GetAllReviews');
        const allReviews = response.data || [];
        const packageReviews = allReviews.filter(review => 
          review.packageId === parseInt(packageId) || 
          review.pacoteId === parseInt(packageId) ||
          review.travelPackageId === parseInt(packageId)
        );
        return packageReviews;
      }
    } catch (error) {
      console.error('Erro ao buscar avaliações do pacote:', error);
      
      // Se erro 404, retorna array vazio
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  // Buscar avaliação por ID
  getById: async (reviewId) => {
    try {
      const response = await api.get(`/Review/GetById/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar avaliação:', error);
      throw error;
    }
  },

  // Criar nova avaliação
  create: async (reviewData) => {
    try {
      const response = await api.post('/Review/Create', reviewData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      throw error;
    }
  },

  // Moderar avaliação (apenas admin)
  moderate: async (reviewId, action) => {
    try {
      const response = await api.put(`/Review/Moderate/${reviewId}`, { action });
      return response.data;
    } catch (error) {
      console.error('Erro ao moderar avaliação:', error);
      throw error;
    }
  },

  // Excluir avaliação (apenas admin)
  delete: async (reviewId) => {
    try {
      await api.delete(`/Review/Delete/${reviewId}`);
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir avaliação:', error);
      throw error;
    }
  },

  // Calcular estatísticas de um pacote (frontend)
  getPackageStats: async (packageId) => {
    try {
      const packageReviews = await this.getByPackageId(packageId);
      
      if (packageReviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: {}
        };
      }

      const totalReviews = packageReviews.length;
      
      // Garantir que rating seja sempre número inteiro
      const sumRatings = packageReviews.reduce((sum, review) => {
        const rating = parseInt(review.rating) || 0; // Converte para int
        return sum + rating;
      }, 0);
      
      const averageRating = sumRatings / totalReviews;

      // Distribuição de notas - também garantindo conversão para int
      const ratingDistribution = {};
      for (let i = 1; i <= 10; i++) {
        ratingDistribution[i] = packageReviews.filter(review => {
          const rating = parseInt(review.rating) || 0;
          return rating === i;
        }).length;
      }

      return {
        averageRating,
        totalReviews,
        ratingDistribution
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      throw error;
    }
  },

  // Verificar se usuário pode avaliar (verificação frontend)
  canUserReview: async (packageId, userId) => {
    try {
      const packageReviews = await this.getByPackageId(packageId);
      
      // Converte para int para comparação segura
      const userIdInt = parseInt(userId);
      
      // Verifica se o usuário já avaliou este pacote
      const userHasReviewed = packageReviews.some(review => {
        const reviewUserId = parseInt(review.userId) || parseInt(review.clientId);
        return reviewUserId === userIdInt;
      });

      return {
        canReview: !userHasReviewed,
        reason: userHasReviewed ? 'Usuário já avaliou este pacote' : 'Pode avaliar'
      };
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      // Em caso de erro, permite avaliar
      return { canReview: true, reason: 'Verificação não disponível' };
    }
  }
};

export default reviewService;
