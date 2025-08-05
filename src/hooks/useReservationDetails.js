import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import reservationService from '../services/reservationService';

export function useReservationDetails(reservationId) {
  const location = useLocation();
  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (reservationId) {
      // Primeiro tenta usar os dados passados via state
      if (location.state?.reservationData) {
        console.log('Usando dados da reserva passados via state:', location.state.reservationData);
        setReservation(location.state.reservationData);
        setIsLoading(false);
      } else {
        // Fallback: buscar dados da API se não tiver no state
        const fetchReservationDetails = async () => {
          setIsLoading(true);
          try {
            const data = await reservationService.getById(reservationId);
            console.log('Detalhes da reserva carregados da API:', data);
            setReservation(data);
          } catch (error) {
            console.error('Erro ao carregar detalhes da reserva:', error);
            setReservation(null);
          } finally {
            setIsLoading(false);
          }
        };

        fetchReservationDetails();
      }
    } else {
      setIsLoading(false);
    }
  }, [reservationId, location.state]);

  return {
    reservation,
    isLoading
  };
}
