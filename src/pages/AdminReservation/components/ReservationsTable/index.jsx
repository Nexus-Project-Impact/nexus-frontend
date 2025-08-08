import React from 'react';
import styles from '../../AdminReservation.module.css';
import { formatCpf, formatCurrency } from '../../../../utils/formatters';

export function ReservationsTable({ reservations, onViewReservation }) {
  
  // // Verificação de segurança
  // if (!reservations || !Array.isArray(reservations)) {
  //   return (
  //     <div style={{ padding: '20px', textAlign: 'center' }}>
  //       <p>Não foi possível carregar os dados das reservas.</p>
  //     </div>
  //   );
  // }

  const formatReservationDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      // Se a data já está no formato brasileiro, retorna como está
      if (dateString.includes('/')) {
        return dateString;
      }
      
      // Se a data está no formato ISO (YYYY-MM-DD), converte para DD/MM/YYYY
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('pt-BR');
      }
      
      return dateString;
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return styles.statusBadge;
    
    switch (status.toLowerCase()) {
      case 'aprovado':
        return `${styles.statusBadge} ${styles.statusAprovado}`;
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
          <th>CPF</th>
          <th>Nº Reserva</th>
          <th>Data da Reserva</th>
          <th>Status de Pagamento</th>
          <th>Valor Total</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((reservation) => (
          <tr key={reservation.id}>
            <td>{reservation.userId || 'N/A'}</td>
            <td>{reservation.userName || 'N/A'}</td>
            <td>{reservation.userDocument ? formatCpf(reservation.userDocument) : 'N/A'}</td>
            <td>{reservation.reservationNumber || 'N/A'}</td>
            <td>{formatReservationDate(reservation.reservationDate)}</td>
            <td>
              <span className={getStatusBadgeClass(reservation.statusPayment)}>
                {reservation.paymentStatus || reservation.statusPayment || 'N/A'}
              </span>
            </td>
            <td className={styles.priceCell}>
              {formatCurrency(reservation.totalValue || reservation.travelPackageValue || reservation.totalPrice || 0)}
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
