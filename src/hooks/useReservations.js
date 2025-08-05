import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import reservationService from '../services/reservationService';
import packageService from '../services/packageService';
import reviewService from '../services/reviewService';
import { getUserFromToken } from '../services/authService';
import { getPackageImageUrl } from '../services/imageService';


// Hook para gerenciar reservas do usuário
export const useUserReservations = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar reservas do usuário
  const loadReservations = async () => {
    
    if (!token) {
      console.log('❌ Token não encontrado, não pode carregar reservas');
      setReservations([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    console.log('🔄 Iniciando carregamento de reservas...');

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
          
          // Usar o serviço de imagem para construir a URL correta
          const packageImage = getPackageImageUrl(packageData) || getPackageImageUrl(reservation);
          
          console.log('URL da imagem construída:', packageImage);
          
          return {
            id: reservation.id,
            packageId: reservation.travelPackageId,
            packageName: reservation.travelPackageDestination,
            packageImage: packageImage,
            dates: formattedDates,
            departureDate: finalDepartureDate,
            returnDate: finalReturnDate,
            destination: reservation.travelPackageDestination,
            hasReview: false // Será verificado depois
          };
        
      }));

      // Verificar se cada pacote foi avaliado pelo usuário
      await checkReviewStatus(processedReservations);
      
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

  // Verificar status de avaliação para cada reserva (se o PACOTE já foi avaliado pelo usuário)
  const checkReviewStatus = async (reservations) => {
    try {
      console.log('=== VERIFICAÇÃO DE AVALIAÇÕES DE PACOTES ===');
      
      // Debug completo do estado Redux
      console.log('Estado completo do Redux user:', user);
      console.log('Token existe?', !!token);
      
      // Tentar obter userId do Redux primeiro
      let userId = user?.id;
      
      // Se não tem userId no Redux, tentar extrair do token
      if (!userId) {
        console.log('UserId não encontrado no Redux, tentando extrair do token...');
        
        // Debug: verificar o token raw
        const rawToken = localStorage.getItem('token');
        console.log('Token raw existe?', !!rawToken);
        
        if (rawToken) {
          try {
            // Decodificar manualmente para debug
            const payload = JSON.parse(atob(rawToken.split('.')[1]));
            console.log('Payload completo do token:', payload);
            console.log('🎯 NAMEID encontrado (este é o userId):', payload.nameid);
            
            const tokenData = getUserFromToken();
            console.log('Dados processados do token:', tokenData);
            
            if (tokenData?.id) {
              userId = tokenData.id;
              console.log('✅ UserId extraído do token:', userId);
            } else {
              console.warn('❌ Token não contém userId válido');
              console.log('Campos disponíveis no payload:', Object.keys(payload));
              
              // Tentar outras possibilidades - INCLUINDO nameid que é o userId
              const possibleUserIds = [
                payload.nameid, // 👈 ESTE É O USERID!
                payload.sub,
                payload.userId,
                payload.id,
                payload.user_id,
                payload.user?.id
              ].filter(Boolean);
              
              console.log('Possíveis userIds encontrados:', possibleUserIds);
              
              if (possibleUserIds.length > 0) {
                userId = possibleUserIds[0];
                console.log('📍 Usando userId alternativo:', userId);
              } else {
                console.error('❌ Nenhum userId encontrado no token');
                return; // Não pode verificar sem userId
              }
            }
          } catch (tokenError) {
            console.error('Erro ao decodificar token:', tokenError);
            return;
          }
        } else {
          console.error('❌ Token não existe no localStorage');
          return;
        }
      } else {
        console.log('✅ UserId obtido do Redux:', userId);
      }
      
      console.log('UserId final para verificação:', userId, 'Tipo:', typeof userId);
      console.log('Verificando avaliações de PACOTES para', reservations.length, 'reservas');
      
      // Buscar todas as reviews
      const allReviews = await reviewService.getAll();
      console.log('Total de reviews obtidas:', allReviews.length);
      
      // Debug: mostrar algumas reviews para entender a estrutura
      if (allReviews.length > 0) {
        console.log('📋 Exemplo de review (estrutura completa):', allReviews[0]);
        console.log('📋 Campos disponíveis na review:', Object.keys(allReviews[0]));
        
        // Mostrar TODOS os valores da review para encontrar o userId
        const review = allReviews[0];
        console.log('📋 TODOS os valores da review:');
        Object.keys(review).forEach(key => {
          console.log(`  - review.${key}:`, review[key]);
        });
        
        console.log('📋 Valores dos campos principais:');
        console.log('  - review.userId:', review.userId);
        console.log('  - review.user_id:', review.user_id);
        console.log('  - review.user?.id:', review.user?.id);
        console.log('  - review.authorId:', review.authorId);
        console.log('  - review.author?.id:', review.author?.id);
        console.log('  - review.customerId:', review.customerId);
        console.log('  - review.customer?.id:', review.customer?.id);
        
        // Mostrar mais algumas reviews se houver
        if (allReviews.length > 1) {
          console.log('📋 Segunda review para comparação:', allReviews[1]);
        }
      }
      
      // Para cada reserva, verificar se o PACOTE já foi avaliado pelo usuário
      reservations.forEach(reservation => {
        console.log(`\n--- Verificando se PACOTE ${reservation.packageId} já foi avaliado pelo usuário ${userId} ---`);
        console.log('Package ID da reserva:', reservation.packageId);
        
        // Procurar por uma review do usuário para este pacote específico
        const userReviewForPackage = allReviews.find(review => {
          if (!review) return false;
          
          // packageId pode vir como packageId ou travelPackageId
          const reviewPackageId = review.packageId || review.travelPackageId || review.package_id;
          
          // 🎯 COMPARAÇÃO DIRETA COM USERID da API
          const reviewUserId = review.userId;
          
          console.log('🎯 COMPARAÇÃO DIRETA POR USERID:', {
            reviewId: review.id,
            reviewPackageId,
            expectedPackageId: reservation.packageId,
            reviewUserId,
            expectedUserId: userId,
            packageMatch: String(reviewPackageId) === String(reservation.packageId),
            userMatch: String(reviewUserId) === String(userId)
          });
          
          // Converter para string para comparação mais segura
          const packageMatch = String(reviewPackageId) === String(reservation.packageId);
          const userMatch = String(reviewUserId) === String(userId);
          
          console.log(`Review ${review.id}: packageMatch=${packageMatch}, userMatch=${userMatch}, bothMatch=${packageMatch && userMatch}`);
          
          return packageMatch && userMatch;
        });
        
        const hasReview = !!userReviewForPackage;
        reservation.hasReview = hasReview;
        
        console.log(`Resultado para reserva ${reservation.id}: PACOTE ${reservation.packageId} hasReview = ${hasReview}`);
        if (hasReview) {
          console.log('✅ Review do pacote encontrada:', userReviewForPackage);
        } else {
          console.log('❌ Pacote ainda não foi avaliado por este usuário');
        }
      });
      
      console.log('=== FIM DA VERIFICAÇÃO ===');
      console.log('Estado final das reservas:', reservations.map(r => ({
        reservaId: r.id,
        packageId: r.packageId,
        packageName: r.packageName,
        hasReview: r.hasReview
      })));
    } catch (error) {
      console.error('Erro ao verificar avaliações:', error);
      // Em caso de erro, deixa todas como não avaliadas
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
