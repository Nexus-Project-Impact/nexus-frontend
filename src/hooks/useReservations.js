import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import reservationService from '../services/reservationService';
import packageService from '../services/packageService';
import imageService from '../services/imageService';

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
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const data = await reservationService.getUserReservations();
      
      // Se não há dados ou é null, trata como array vazio
      if (!data) {
        setReservations([]);
        setIsLoading(false);
        return;
      }
      
      if (!Array.isArray(data)) {
        console.warn('Dados recebidos não são um array:', data);
        setReservations([]);
        setIsLoading(false);
        return;
      }
      
      // Se o array está vazio, é um caso válido (usuário sem reservas)
      if (data.length === 0) {
        setReservations([]);
        setIsLoading(false);
        return;
      }
      
      // Processar os dados para garantir que tenham a estrutura esperada
      const processedReservations = await Promise.all(data.map(async (reservation) => {
          
          // Debug: log da estrutura da reserva
          console.log('Estrutura da reserva recebida:', reservation);
          
          // Tentar buscar dados do pacote para pegar as datas corretas e a imagem
          const packageData = await packageService.getPackageById(reservation.travelPackageId);
          console.log('Dados do pacote obtidos:', packageData);
          
          const finalDepartureDate = packageData?.departureDate || reservation.departureDate || reservation.dataIda;
          const finalReturnDate = packageData?.returnDate || reservation.returnDate || reservation.dataVolta;
          
          const formattedDates = formatDates(finalDepartureDate, finalReturnDate);
          
          // Usar o serviço de imagem para obter a URL correta
          const packageImage = await imageService.findWorkingImageUrl(
            reservation.travelPackageId, 
            packageData
          );
          
          console.log('URL da imagem construída:', packageImage);
          
          return {
            id: reservation.id,
            packageId: reservation.travelPackageId,
            packageName: reservation.travelPackageDestination,
            packageImage: packageImage,
            dates: formattedDates,
            departureDate: finalDepartureDate,
            returnDate: finalReturnDate,
            destination: reservation.travelPackageDestination
          };
        
      }));

      
      setReservations(processedReservations);
    } catch (err) {
      console.error('Erro ao carregar reservas:', err);
      
      // Se é erro 404, provavelmente o usuário não tem reservas
      if (err.response?.status === 404) {
        setReservations([]);
        setError(null); // Não é um erro real, só não há reservas
      } else {
        setError(`Erro ao carregar suas reservas: ${err.response?.data?.message || err.message}`);
        setReservations([]);
      }
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
        
        // Usar o mesmo formato da tela de adicionar avaliação
        const departureStr = departure.toLocaleDateString('pt-BR');
        const returnStr = returnD.toLocaleDateString('pt-BR');
        return `${departureStr} - ${returnStr}`;
      }
      
      // Tentar parser a data de diferentes formatos
      let departure;
      if (typeof departureDate === 'string') {
        // Se é uma string ISO, converter
        departure = new Date(departureDate);
      } else {
        departure = new Date(departureDate);
      }
      
      let returnD = null;
      if (returnDate) {
        if (typeof returnDate === 'string') {
          returnD = new Date(returnDate);
        } else {
          returnD = new Date(returnDate);
        }
      }
      
      // Verificar se as datas são válidas
      if (isNaN(departure.getTime())) {
        return 'Datas não disponíveis';
      }
      
      // Usar o mesmo formato da tela de adicionar avaliação
      const departureStr = departure.toLocaleDateString('pt-BR');
      
      if (returnD && !isNaN(returnD.getTime())) {
        const returnStr = returnD.toLocaleDateString('pt-BR');
        return `${departureStr} - ${returnStr}`;
      }
      
      return departureStr;
    } catch (error) {
      console.warn('Erro ao formatar datas:', error);
      // Fallback: criar datas demonstrativas
      const today = new Date();
      const departure = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
      const returnD = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000));
      
      // Usar o mesmo formato da tela de adicionar avaliação
      const departureStr = departure.toLocaleDateString('pt-BR');
      const returnStr = returnD.toLocaleDateString('pt-BR');
      return `${departureStr} - ${returnStr}`;
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
