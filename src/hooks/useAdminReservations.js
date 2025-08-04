import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import reservationService from '../services/reservationService';

export function useAdminReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        const data = await reservationService.getAll();
        console.log('Reservas carregadas:', data);
        setReservations(data);
      } catch (error) {
        console.error('Erro ao carregar reservas:', error);
        alert('Não foi possível carregar as reservas.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleViewReservation = (reservationId) => {
    navigate(`/admin/reservas/visualizar/${reservationId}`);
  };

  return {
    reservations,
    isLoading,
    handleViewReservation
  };
}
