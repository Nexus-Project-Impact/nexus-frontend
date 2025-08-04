import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import reviewService from '../services/reviewService';
import reservationService from '../services/reservationService';
import { notificationService } from '../services/notificationService';

// Hook para gerenciar avaliações
export const useReview = (packageId) => {
  // Debug: verificar o valor do packageId recebido (apenas se for inválido)
  if (!packageId || packageId === '0' || isNaN(parseInt(packageId))) {
    console.warn('DEBUG useReview - packageId recebido é inválido:', packageId, 'tipo:', typeof packageId);
  }
  
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [canReview, setCanReview] = useState(false);

  // Pegar dados do usuário logado
  const { user } = useSelector((state) => state.auth || {});

  // Carregar avaliações do pacote
  const loadReviews = async () => {
    if (!packageId || packageId === '0' || isNaN(parseInt(packageId))) {
      console.warn('useReview.loadReviews: packageId inválido:', packageId);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log(`useReview.loadReviews: Carregando reviews para packageId ${packageId}`);

      // Buscar avaliações e estatísticas em paralelo
      const [reviewsData, statsData] = await Promise.all([
        reviewService.getByPackageId(packageId),
        reviewService.getPackageStats(packageId)
      ]);

      console.log(`useReview.loadReviews: Reviews carregadas para packageId ${packageId}:`, reviewsData);
      console.log(`useReview.loadReviews: Stats carregadas para packageId ${packageId}:`, statsData);

      // Garantir que reviewsData seja um array
      const processedReviews = Array.isArray(reviewsData) ? reviewsData : [];
      
      setReviews(processedReviews);
      setStats(statsData || {
        averageRating: 0,
        totalReviews: processedReviews.length,
        ratingDistribution: {}
      });

      console.log(`useReview.loadReviews: Estado final - reviews:`, processedReviews);
      console.log(`useReview.loadReviews: Estado final - stats:`, statsData);

    } catch (err) {
      console.error('Erro ao carregar reviews:', err);
      
      // Se é 404, não é um erro real - só não há reviews ainda
      if (err.response?.status === 404) {
        console.log('404 recebido, configurando estado vazio para reviews');
        setReviews([]);
        setStats({
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: {}
        });
        setError(null);
      } else {
        setError('Erro ao carregar avaliações');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar se usuário pode avaliar
  const checkCanReview = async () => {
    if (!packageId || !user?.id) {
      setCanReview(false);
      return;
    }

    try {
      // 1. Verificar se usuário já avaliou este pacote
      const reviewCheck = await reviewService.canUserReview(packageId, user.id);
      if (!reviewCheck.canReview) {
        setCanReview(false);
        return;
      }

      // 2. Verificar se usuário tem reserva finalizada para este pacote
      const userReservations = await reservationService.getUserReservations();
      
      // Se não há reservas, não pode avaliar
      if (!userReservations || userReservations.length === 0) {
        setCanReview(false);
        return;
      }
      
      const hasFinishedReservation = userReservations.some(reservation => {
        const packageIdMatch = reservation.packageId === parseInt(packageId) || 
                              reservation.travelPackageId === parseInt(packageId);
        const isFinished = reservation.status === 'finalizada' || reservation.status === 'Finalizada';
        return packageIdMatch && isFinished;
      });

      setCanReview(hasFinishedReservation);
    } catch (err) {
      console.error('Erro ao verificar permissão:', err);
      
      // Em caso de erro na verificação, permite avaliar se o usuário está logado
      setCanReview(!!user?.id);
    }
  };

  // Adicionar nova avaliação
  const addReview = async (reviewData) => {
    try {
      setError(null);
      
      
      
      // Tentar obter packageId de múltiplas fontes
      let finalPackageId = packageId;
      
      // Se packageId da URL não é válido, tentar obter do reviewData
      if (!finalPackageId || finalPackageId === '0' || isNaN(parseInt(finalPackageId))) {
        console.log('packageId da URL inválido, tentando outras fontes...');
        
        // Tentar obter do reviewData
        if (reviewData.packageId) {
          finalPackageId = reviewData.packageId;
          console.log('Usando packageId do reviewData:', finalPackageId);
        }
        
        // Tentar obter do reservationId (se houver)
        if (!finalPackageId && reviewData.reservationId) {
          console.log('Tentando obter packageId via reservationId (não implementado ainda)');
        }
      }
      
      // Verificar se packageId é válido
      const packageIdNumber = parseInt(finalPackageId);
      if (isNaN(packageIdNumber) || packageIdNumber <= 0) {
        console.error('ERRO: packageId inválido após todas as tentativas!', { 
          packageIdOriginal: packageId, 
          finalPackageId, 
          packageIdNumber,
          reviewData 
        });
        throw new Error(`packageId inválido: ${finalPackageId}`);
      }
      
      
      // Preparar dados da avaliação
      const reviewPayload = {
        travelPackageId: packageIdNumber, // Usando o número validado
        rating: parseInt(reviewData.rating),
        comment: reviewData.comment || '',
        // Adicionar campos do usuário se disponíveis
        ...(user?.id && { userId: user.id }),
        ...(user?.name && { clientName: user.name }),
        ...(user?.nome && { clientName: user.nome }),
        ...reviewData
      };

      

      
      const newReview = await reviewService.create(reviewPayload);

      // Atualizar lista local se a criação foi bem-sucedida
      if (newReview) {
        setReviews(prev => [newReview, ...prev]);
        
        // Recarregar estatísticas
        try {
          const newStats = await reviewService.getPackageStats(packageId);
          setStats(newStats);
        } catch (statsError) {
          console.warn('Erro ao recarregar estatísticas:', statsError);
        }

        // Usuário não pode mais avaliar após avaliar
        setCanReview(false);
      }

      return { success: true, review: newReview };
    } catch (err) {
      console.error('Erro ao adicionar review:', err);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Erro ao enviar avaliação';
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Atualizar avaliação existente (removido pois não há endpoint)
  const updateReview = async (reviewId, reviewData) => {
    console.warn('Funcionalidade de atualização não disponível - endpoint não existe');
    return { success: false, error: 'Funcionalidade não disponível' };
  };

  // Excluir avaliação (apenas admin)
  const deleteReview = async (reviewId) => {
    try {
      setError(null);
      
      await reviewService.delete(reviewId);
      
      // Remover da lista local
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      
      // Recarregar estatísticas
      const newStats = await reviewService.getPackageStats(packageId);
      setStats(newStats);

      notificationService.review.deleteSuccess();
      return { success: true };
    } catch (err) {
      setError('Erro ao excluir avaliação');
      console.error('Erro ao excluir review:', err);
      notificationService.review.deleteError();
      return { success: false, error: err.message };
    }
  };

  // Carregar dados quando packageId mudar
  useEffect(() => {
    if (packageId) {
      loadReviews();
      // Não chamar checkCanReview aqui para evitar loops infinitos
    }
  }, [packageId]);

  return {
    reviews,
    stats,
    isLoading,
    error,
    canReview,
    addReview,
    updateReview,
    deleteReview,
    refreshReviews: loadReviews,
    checkCanReview // Expor função para verificação manual
  };
};

// Hook adicional para buscar reviews de um usuário específico
export const useUserReviews = (userId) => {
  const [userReviews, setUserReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadUserReviews = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Busca todas as reviews e filtra pelo usuário
      const allReviews = await reviewService.getAll();
      const userReviewsList = allReviews.filter(review => 
        review.userId === userId || review.clientId === userId
      );

      setUserReviews(userReviewsList);
    } catch (err) {
      setError('Erro ao carregar suas avaliações');
      console.error('Erro ao carregar user reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserReviews();
  }, [userId]);

  return {
    userReviews,
    isLoading,
    error,
    refreshUserReviews: loadUserReviews
  };
};
