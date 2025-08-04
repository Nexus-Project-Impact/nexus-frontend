import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import reservationService from '../../services/reservationService';
import { ReservationCard } from './components/ReservationCard';
import styles from './ReservasPage.module.css';

export default function ReservasPage() {
  const { user } = useSelector((state) => state.auth);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Garante que só busca as reservas se o usuário existir
    if (user?.id) {
      reservationService.getById(user.id).then(data => {
        setReservations(data);
        setIsLoading(false);
      });
    }
  }, [user]); // Roda o efeito quando o usuário for carregado

  if (isLoading) {
    return <div className={styles.container}><p>Carregando suas reservas...</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Minhas Reservas</h1>

      {reservations.length === 0 ? (
        <p>Você ainda não possui reservas.</p>
      ) : (
        <div className={styles.reservationsList}>
          {reservations.map(res => (
            <ReservationCard key={res.id} reservation={res} />
          ))}
        </div>
      )}
    </div>
  );
}