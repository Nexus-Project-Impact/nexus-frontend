import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import reservationService from '../services/reservationService';

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
