import { useState, useEffect } from 'react';
import reservationService from '../services/reservationService';

export function useReservationDetails(reservationId) {
  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (reservationId) {
      console.log('Buscando reserva com ID:', reservationId);
      const fetchReservationDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await reservationService.getById(reservationId);
          console.log('Detalhes da reserva carregados:', data);
          setReservation(data);
        } catch (error) {
          console.error('Erro ao carregar detalhes da reserva:', error);
          console.error('ID da reserva que falhou:', reservationId);
          setError(error);
          setReservation(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchReservationDetails();
    } else {
      console.log('Nenhum ID de reserva fornecido');
      setError('ID de reserva não fornecido');
      setIsLoading(false);
    }
  }, [reservationId]);

  return {
    reservation,
    isLoading,
    error
  };
}
