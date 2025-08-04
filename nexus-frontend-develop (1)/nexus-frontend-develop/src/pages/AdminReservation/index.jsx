import React from 'react';
import { useAdminReservations } from '../../hooks/useAdminReservations';
import { ReservationsTable } from './components/ReservationsTable';
import styles from './AdminReservation.module.css';

export function AdminReservation() {
  const { reservations, isLoading, handleViewReservation } = useAdminReservations();

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <p>Carregando reservas...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
        <h1 className={styles.title}>Lista das Reservas</h1>
        <p className={styles.subtitle}>
          Total de reservas: {reservations.length}
        </p>
            <div className={styles.searchBar}>
              <input type="text" placeholder="Destino" />
              <input type="text" placeholder="09/08 - 09/09" />
              <input type="text" placeholder="ID do pacote" />
              <button className={styles.searchButton}>
                <svg xmlns="http://www.w3.org/2000/svg" 
                xmlns:xlink="http://www.w3.org/1999/xlink" 
                enable-background="new 0 0 32 32" id="Glyph" width='30px' height="30px"
                version="1.1" viewBox="0 0 32 32" xml:space="preserve">
                <path fill="white" d="M27.414,24.586l-5.077-5.077C23.386,17.928,24,16.035,24,14c0-5.514-4.486-10-10-10S4,8.486,4,14  s4.486,10,10,10c2.035,0,3.928-0.614,5.509-1.663l5.077,5.077c0.78,0.781,2.048,0.781,2.828,0  C28.195,26.633,28.195,25.367,27.414,24.586z M7,14c0-3.86,3.14-7,7-7s7,3.14,7,7s-3.14,7-7,7S7,17.86,7,14z" id="XMLID_223_"/></svg>
              </button>
            </div>

      {reservations.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhuma reserva encontrada.</p>
        </div>
      ) : (
        <ReservationsTable 
          reservations={reservations} 
          onViewReservation={handleViewReservation} 
        />
      )}
    </div>
  );
}
