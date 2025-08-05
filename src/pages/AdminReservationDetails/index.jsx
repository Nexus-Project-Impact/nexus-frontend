import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useReservationDetails } from '../../hooks/useReservationDetails';
import styles from '../AdminReservation/AdminReservation.module.css';

export function AdminReservationDetails() {
  const { id } = useParams();
  const { reservation, isLoading, error } = useReservationDetails(id);

  console.log('AdminReservationDetails - ID:', id);
  console.log('AdminReservationDetails - Reservation:', reservation);
  console.log('AdminReservationDetails - IsLoading:', isLoading);

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <p>Carregando detalhes da reserva...</p>
        <p><small>ID da reserva: {id}</small></p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className={styles.pageContainer}>
        <h2>Reserva não encontrada</h2>
        <p>Não foi possível carregar os detalhes da reserva com ID: {id}</p>
        <p><small>Verifique se o ID da reserva está correto e tente novamente.</small></p>
        <Link to="/admin/reservas" className={styles.actionLink}>
          Voltar para Reservas
        </Link>
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
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Detalhes da Reserva #{reservation.id}</h1>
      </div>

      <div className={styles.detailsContainer}>
        <div className={styles.detailsSection}>
          <h3>Informações do Cliente</h3>
          <div className={styles.detailItem}>
            <strong>ID do Cliente:</strong> {reservation.userId || 'N/A'}
          </div>
          <div className={styles.detailItem}>
            <strong>Nome:</strong> {reservation.clientName || reservation.userName || reservation.user?.name || 'N/A'}
          </div>
          <div className={styles.detailItem}>
            <strong>E-mail:</strong> {reservation.clientEmail || reservation.userEmail || reservation.user?.email || 'N/A'}
          </div>
          <div className={styles.detailItem}>
            <strong>Telefone:</strong> {reservation.clientPhone || reservation.userPhone || reservation.user?.phone || 'N/A'}
          </div>
        </div>

        <div className={styles.detailsSection}>
          <h3>Informações da Reserva</h3>
          <div className={styles.detailItem}>
            <strong>ID da Reserva:</strong> {reservation.id || 'N/A'}
          </div>
          <div className={styles.detailItem}>
            <strong>Número da Reserva:</strong> {reservation.reservationNumber || 'N/A'}
          </div>
          <div className={styles.detailItem}>
            <strong>Pacote:</strong> {reservation.packageName || reservation.travelPackageName || reservation.travelPackage?.name || `Pacote ID: ${reservation.travelPackageId}` || 'N/A'}
          </div>
          <div className={styles.detailItem}>
            <strong>Data da Viagem:</strong> {reservation.travelDate || reservation.departureDate || reservation.travelPackage?.departureDate || 'N/A'}
          </div>
          <div className={styles.detailItem}>
            <strong>Data da Reserva:</strong> {reservation.reservationDate ? new Date(reservation.reservationDate).toLocaleDateString('pt-BR') : (reservation.createdAt ? new Date(reservation.createdAt).toLocaleDateString('pt-BR') : 'N/A')}
          </div>
          <div className={styles.detailItem}>
            <strong>Status de Pagamento:</strong> 
            <span className={getStatusBadgeClass(reservation.paymentStatus || reservation.status)}>
              {reservation.paymentStatus || reservation.status || 'Pendente'}
            </span>
          </div>
          <div className={styles.detailItem}>
            <strong>Preço Total:</strong> 
            <span className={styles.priceCell}>
              R$ {(reservation.totalPrice || reservation.price || reservation.travelPackage?.price || 0).toLocaleString('pt-BR')}
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
