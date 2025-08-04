import api from './api';

// Serviço para gerenciar avaliações
const reviewService = {

  // Buscar todas as avaliações (getAll)
  getAll: async () => {
    try {
      console.log('reviewService.getAll: Buscando todas as avaliações');
      const response = await api.get('/Review/GetAllReviews');
      
      // Garantir que sempre retorna array
      const reviews = Array.isArray(response.data) ? response.data : [];
      console.log(`reviewService.getAll: Total de reviews encontradas: ${reviews.length}`);
      
      return reviews;
    } catch (error) {
      console.error('reviewService.getAll: Erro ao buscar todas as avaliações:', error);
      
      // Se for 404, retorna array vazio em vez de erro
      if (error.response?.status === 404) {
        console.log('reviewService.getAll: Nenhuma avaliação encontrada (404), retornando array vazio');
        return [];
      }
      
      throw error;
    }
  },

  // Buscar avaliações de um pacote específico (usa endpoint específico se disponível)
  getByPackageId: async (packageId) => {
    try {
      console.log(`reviewService.getByPackageId: Buscando reviews para packageId: ${packageId}`);
      
      // Primeiro, tenta usar o endpoint específico se existir
      try {
        const response = await api.get(`/Review/GetByPackageId/${packageId}`);
        console.log(`reviewService.getByPackageId: Sucesso com endpoint específico para packageId ${packageId}:`, response.data);
        
        // Garantir que sempre retorna array
        const reviews = Array.isArray(response.data) ? response.data : (response.data ? [response.data] : []);
        return reviews;
      } catch (endpointError) {
        // Se o endpoint específico não existir (404), usa fallback
        if (endpointError.response?.status === 404) {
          console.warn(`reviewService.getByPackageId: Endpoint GetByPackageId/${packageId} não encontrado, usando fallback`);
          
          const response = await api.get('/Review/GetAllReviews');
          const allReviews = Array.isArray(response.data) ? response.data : [];
          console.log(`reviewService.getByPackageId: Total de reviews obtidas via fallback:`, allReviews.length);
          
          // Filtra as reviews do pacote específico no frontend
          const packageReviews = allReviews.filter(review => {
            if (!review) return false;
            
            const reviewPackageId = review.packageId || review.travelPackageId || review.pacoteId;
            const match = reviewPackageId === parseInt(packageId);
            if (match) {
              console.log(`reviewService.getByPackageId: Review encontrada para packageId ${packageId}:`, review);
            }
            return match;
          });
          
          console.log(`reviewService.getByPackageId: Reviews filtradas para packageId ${packageId}:`, packageReviews);
          return packageReviews;
        } else {
          // Se foi outro tipo de erro, relança
          throw endpointError;
        }
      }
    } catch (error) {
      console.error('reviewService.getByPackageId: Erro ao buscar avaliações do pacote:', error);
      
      // Em caso de 404, retorna array vazio em vez de erro
      if (error.response?.status === 404) {
        console.log(`reviewService.getByPackageId: Nenhuma review encontrada para packageId ${packageId}, retornando array vazio`);
        return [];
      }
      
      // Para outros erros, ainda lança a exceção
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
      // Debug: verificar o que está sendo enviado
      console.log('DEBUG reviewService.create - dados recebidos:', reviewData);
      console.log('DEBUG reviewService.create - travelPackageId:', reviewData.travelPackageId);
      console.log('DEBUG reviewService.create - typeof travelPackageId:', typeof reviewData.travelPackageId);
      
      const response = await api.post('/Review/Create', reviewData);
      
      // Debug: verificar resposta do servidor
      console.log('DEBUG reviewService.create - resposta do servidor:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      console.error('DEBUG reviewService.create - dados que causaram erro:', reviewData);
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

  // Verificar se usuário pode avaliar um pacote
  canUserReview: async (packageId, userId) => {
    try {
      // Busca todas as reviews e verifica se o usuário já avaliou este pacote
      const allReviews = await this.getAll();
      const userReviewForPackage = allReviews.find(review => 
        (review.packageId === parseInt(packageId) || review.travelPackageId === parseInt(packageId)) &&
        (review.userId === parseInt(userId) || review.clientId === parseInt(userId))
      );
      
      return {
        canReview: !userReviewForPackage, // true se não encontrou review do usuário
        hasReviewed: !!userReviewForPackage
      };
    } catch (error) {
      console.error('Erro ao verificar se usuário pode avaliar:', error);
      // Em caso de erro, assumir que pode avaliar
      return { canReview: true, hasReviewed: false };
    }
  },

  // Calcular estatísticas de um pacote (frontend)
  getPackageStats: async (packageId) => {
    try {
      console.log(`reviewService.getPackageStats: Calculando stats para packageId ${packageId}`);
      
      const packageReviews = await reviewService.getByPackageId(packageId);
      console.log(`reviewService.getPackageStats: Reviews recebidas:`, packageReviews);
      
      // Verificar se packageReviews é válido
      if (!packageReviews || !Array.isArray(packageReviews) || packageReviews.length === 0) {
        console.log(`reviewService.getPackageStats: Nenhuma review encontrada para packageId ${packageId}`);
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: {}
        };
      }

      const totalReviews = packageReviews.length;
      console.log(`reviewService.getPackageStats: Total de reviews: ${totalReviews}`);
      
      // Garantir que rating seja sempre número inteiro
      const sumRatings = packageReviews.reduce((sum, review) => {
        if (!review) {
          console.warn('reviewService.getPackageStats: Review inválida encontrada:', review);
          return sum;
        }
        
        const rating = parseInt(review.rating) || 0; // Converte para int
        console.log(`reviewService.getPackageStats: Processando rating: ${rating} da review:`, review);
        return sum + rating;
      }, 0);
      
      const averageRating = totalReviews > 0 ? sumRatings / totalReviews : 0;
      console.log(`reviewService.getPackageStats: Média calculada: ${averageRating}`);

      // Distribuição de notas - também garantindo conversão para int
      const ratingDistribution = {};
      for (let i = 1; i <= 10; i++) {
        ratingDistribution[i] = packageReviews.filter(review => {
          if (!review) return false;
          const rating = parseInt(review.rating) || 0;
          return rating === i;
        }).length;
      }

      const stats = {
        averageRating,
        totalReviews,
        ratingDistribution
      };
      
      console.log(`reviewService.getPackageStats: Stats finais para packageId ${packageId}:`, stats);
      return stats;
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      // Retornar stats vazias em caso de erro para não quebrar a aplicação
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {}
      };
    }
  }

};

export default reviewService;
