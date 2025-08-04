import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useReservationDetails } from '../../hooks/useReservationDetails';
import styles from '../AdminReservation/AdminReservation.module.css';

export function AdminReservationDetails() {
  const { id } = useParams();
  const { reservation, isLoading } = useReservationDetails(id);

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <p>Carregando detalhes da reserva...</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className={styles.pageContainer}>
        <h2>Reserva não encontrada</h2>
        <Link to="/admin/reservas" className={styles.actionLink}>
          Voltar para Reservas
        </Link>
      </div>
    );
  }

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
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Detalhes da Reserva #{reservation.id}</h1>
      </div>

      <div className={styles.detailsContainer}>
        <div className={styles.detailsSection}>
          <h3>Informações do Cliente</h3>
          <div className={styles.detailItem}>
            <strong>ID do Cliente:</strong> {reservation.userId}
          </div>
          <div className={styles.detailItem}>
            <strong>Nome:</strong> {reservation.clientName}
          </div>
          <div className={styles.detailItem}>
            <strong>E-mail:</strong> {reservation.clientEmail}
          </div>
          <div className={styles.detailItem}>
            <strong>Telefone:</strong> {reservation.clientPhone}
          </div>
        </div>

        <div className={styles.detailsSection}>
          <h3>Informações da Reserva</h3>
          <div className={styles.detailItem}>
            <strong>ID da Reserva:</strong> {reservation.id}
          </div>
          <div className={styles.detailItem}>
            <strong>Pacote:</strong> {reservation.packageName}
          </div>
          <div className={styles.detailItem}>
            <strong>Data da Viagem:</strong> {reservation.travelDate}
          </div>
          <div className={styles.detailItem}>
            <strong>Data da Reserva:</strong> {reservation.reservationDate}
          </div>
          <div className={styles.detailItem}>
            <strong>Status de Pagamento:</strong> 
            <span className={getStatusBadgeClass(reservation.paymentStatus)}>
              {reservation.paymentStatus}
            </span>
          </div>
          <div className={styles.detailItem}>
            <strong>Preço Total:</strong> 
            <span className={styles.priceCell}>
              R$ {reservation.totalPrice.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Link to="/admin/reservas" className={styles.actionLink}>
          Voltar para Reservas
        </Link>
      </div>
    </div>
  );
}
