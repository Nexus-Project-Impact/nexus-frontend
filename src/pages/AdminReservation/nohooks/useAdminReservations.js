import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllReservations } from '../../../services/reservationService';

export function useAdminReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        const data = await getAllReservations();
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
    // Navegar para a página de detalhes da reserva
    navigate(`/admin/reservas/visualizar/${reservationId}`);
  };

  return {
    reservations,
    isLoading,
    handleViewReservation
  };
}
