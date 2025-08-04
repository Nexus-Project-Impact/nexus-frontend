import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import reviewService from '../services/reviewService';
import reservationService from '../services/reservationService';
import { notificationService } from '../services/notificationService';

// Hook para gerenciar avaliações
export const useReview = (packageId) => {
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
    if (!packageId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Buscar avaliações e estatísticas em paralelo
      const [reviewsData, statsData] = await Promise.all([
        reviewService.getByPackageId(packageId),
        reviewService.getPackageStats(packageId)
      ]);

      setReviews(reviewsData);
      setStats(statsData);

    } catch (err) {
      setError('Erro ao carregar avaliações');
      console.error('Erro ao carregar reviews:', err);
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
      const hasFinishedReservation = userReservations.some(reservation => {
        const packageIdMatch = reservation.packageId === parseInt(packageId);
        const isFinished = reservation.status === 'finalizada' || reservation.status === 'Finalizada';
        return packageIdMatch && isFinished;
      });

      setCanReview(hasFinishedReservation);
    } catch (err) {
      console.error('Erro ao verificar permissão:', err);
      setCanReview(false);
    }
  };

  // Adicionar nova avaliação
  const addReview = async (reviewData) => {
    try {
      setError(null);
      
      // Preparar dados da avaliação
      const reviewPayload = {
        packageId: parseInt(packageId),
        userId: user.id,
        rating: parseInt(reviewData.rating),
        comment: reviewData.comment || '',
        clientName: user.name || user.nome || 'Usuário',
        ...reviewData
      };

      console.log('📝 Enviando avaliação:', reviewPayload);
      
      const newReview = await reviewService.create(reviewPayload);

      // Atualizar lista local
      setReviews(prev => [newReview, ...prev]);
      
      // Recarregar estatísticas
      const newStats = await reviewService.getPackageStats(packageId);
      setStats(newStats);

      // Usuário não pode mais avaliar após avaliar
      setCanReview(false);

      notificationService.review.createSuccess();
      return { success: true, review: newReview };
    } catch (err) {
      setError('Erro ao enviar avaliação');
      console.error('Erro ao adicionar review:', err);
      notificationService.review.createError();
      return { success: false, error: err.message };
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
      checkCanReview();
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
