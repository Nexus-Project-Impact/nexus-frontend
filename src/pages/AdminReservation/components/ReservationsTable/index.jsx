import React from 'react';
import styles from '../../AdminReservation.module.css';

export function ReservationsTable({ reservations, onViewReservation }) {
  
  // Verificação de segurança
  if (!reservations || !Array.isArray(reservations)) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Não foi possível carregar os dados das reservas.</p>
      </div>
    );
  }

  const getStatusBadgeClass = (status) => {
    if (!status || typeof status !== 'string') {
      return styles.statusBadge;
    }
    
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
            <td>{reservation.userId || 'N/A'}</td>
            <td>{reservation.clientName || reservation.userName || 'N/A'}</td>
            <td>{reservation.id || 'N/A'}</td>
            <td>{reservation.travelDate || reservation.departureDate || 'N/A'}</td>
            <td>{reservation.reservationDate || reservation.createdAt || 'N/A'}</td>
            <td>
              <span className={getStatusBadgeClass(reservation.paymentStatus || 'pendente')}>
                {reservation.paymentStatus || 'Pendente'}
              </span>
            </td>
            <td className={styles.priceCell}>
              R$ {(reservation.totalPrice || reservation.price || 0).toLocaleString('pt-BR')}
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
