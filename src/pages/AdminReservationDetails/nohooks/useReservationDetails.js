import { useState, useEffect } from 'react';
import { getReservationById } from '../../../services/reservationService';

export function useReservationDetails(reservationId) {
  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (reservationId) {
      const fetchReservationDetails = async () => {
        setIsLoading(true);
        try {
          const data = await getReservationById(reservationId);
          console.log('Detalhes da reserva carregados:', data);
          setReservation(data);
        } catch (error) {
          console.error('Erro ao carregar detalhes da reserva:', error);
          setReservation(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchReservationDetails();
    } else {
      setIsLoading(false);
    }
  }, [reservationId]);

  return {
    reservation,
    isLoading
  };
}
