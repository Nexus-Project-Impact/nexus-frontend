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
    
    if (!token) {
      setReservations([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const data = await reservationService.getUserReservations();
      
      if (!Array.isArray(data)) {
        console.warn('Dados recebidos não são um array:', data);
        setReservations([]);
        setIsLoading(false);
        return;
      }
      
      // Processar os dados para garantir que tenham a estrutura esperada
      const processedReservations = data.map(reservation => {
        
        return {
          id: reservation.id,
          packageId: reservation.travelPackageId,
          packageName: reservation.travelPackageDestination,
          packageImage: reservation.travelPackageImageUrl,
          dates: reservation.reservationDate || formatDates(reservation.departureDate || reservation.dataIda, reservation.returnDate || reservation.dataVolta)
        };

      });

      console.log(processedReservations);
      
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
      if (!departureDate) {
        // Se não há data de ida, criar datas fictícias para demonstração
        const today = new Date();
        const departure = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000)); // +7 dias
        const returnD = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000)); // +14 dias
        
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const departureStr = departure.toLocaleDateString('pt-BR', options);
        const returnStr = returnD.toLocaleDateString('pt-BR', options);
        return `${departureStr} à ${returnStr}`;
      }
      
      const departure = new Date(departureDate);
      const returnD = returnDate ? new Date(returnDate) : null;
      
      // Verificar se as datas são válidas
      if (isNaN(departure.getTime())) {
        return 'Datas não disponíveis';
      }
      
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      const departureStr = departure.toLocaleDateString('pt-BR', options);
      
      if (returnD && !isNaN(returnD.getTime())) {
        const returnStr = returnD.toLocaleDateString('pt-BR', options);
        return `${departureStr} à ${returnStr}`;
      }
      
      return departureStr;
    } catch (error) {
      console.warn('Erro ao formatar datas:', error);
      // Fallback: criar datas demonstrativas
      const today = new Date();
      const departure = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
      const returnD = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000));
      
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      const departureStr = departure.toLocaleDateString('pt-BR', options);
      const returnStr = returnD.toLocaleDateString('pt-BR', options);
      return `${departureStr} à ${returnStr}`;
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

  // Carregar dados quando o token mudar
  useEffect(() => {
    loadReservations();
  }, [token]); // Removendo dependência do user?.id

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
