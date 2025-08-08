import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import reservationService from '../services/reservationService';

export function useAdminReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchReservations = async (filters = {}) => {
    setIsLoading(true);
    try {
      const data = await reservationService.searchWithFilters(filters);
      console.log('Reservas carregadas/filtradas:', data);
      setReservations(data);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      alert('Não foi possível buscar as reservas.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Carrega todas as reservas na inicialização (sem filtros)
    searchReservations();
  }, []);

  const handleViewReservation = (reservationId) => {
    // Encontra a reserva completa pelos dados já carregados
    const selectedReservation = reservations.find(reservation => 
      reservation.id === reservationId || reservation.reservationId === reservationId
    );
    
    // Navega passando os dados da reserva via state
    navigate(`/admin/reservas/visualizar/${reservationId}`, {
      state: { reservationData: selectedReservation }
    });
  };

  return {
    reservations,
    isLoading,
    searchReservations,
    handleViewReservation
  };
}
