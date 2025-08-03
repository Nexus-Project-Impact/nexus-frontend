import React from 'react';
import styles from '../../AdminReservation.module.css';

export function ReservationsTable({ reservations, onViewReservation }) {
  
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pago':
        return `${styles.statusBadge} ${styles.statusPago}`;
      case 'pendente':
        return `${styles.statusBadge} ${styles.statusPendente}`;
      case 'cancelado':
        return `${styles.statusBadge} ${styles.statusCancelado}`;
      default:
        return styles.statusBadge;
    }
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID Cliente</th>
          <th>Nome do Cliente</th>
          <th>ID Reserva</th>
          <th>Data da Viagem</th>
          <th>Data da Reserva</th>
          <th>Status de Pagamento</th>
          <th>Preço</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((reservation) => (
          <tr key={reservation.id}>
            <td>{reservation.userId}</td>
            <td>{reservation.clientName}</td>
            <td>{reservation.id}</td>
            <td>{reservation.travelDate}</td>
            <td>{reservation.reservationDate}</td>
            <td>
              <span className={getStatusBadgeClass(reservation.paymentStatus)}>
                {reservation.paymentStatus}
              </span>
            </td>
            <td className={styles.priceCell}>
              R$ {reservation.totalPrice.toLocaleString('pt-BR')}
            </td>
            <td className={styles.actions}>
              <button 
                onClick={() => onViewReservation(reservation.id)} 
                className={styles.actionLink}
              >
                Visualizar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
