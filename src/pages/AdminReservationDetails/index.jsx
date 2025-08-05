import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useReservationDetails } from '../../hooks/useReservationDetails';
import { formatCpf, formatPhone, formatCurrency } from '../../utils/formatters';
import styles from '../AdminReservation/AdminReservation.module.css';

export function AdminReservationDetails() {
  const { id } = useParams();
  const { reservation, isLoading, error } = useReservationDetails(id);

  // Função para formatar data de reserva
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
            <strong>Nome:</strong> {reservation.clientName || reservation.userName}
          </div>
          <div className={styles.detailItem}>
            <strong>CPF:</strong> {reservation.userDocument ? formatCpf(reservation.userDocument) : 'N/A'}
          </div>
          <div className={styles.detailItem}>
            <strong>E-mail:</strong> {reservation.clientEmail || reservation.userEmail || 'N/A'}
          </div>
          <div className={styles.detailItem}>
            <strong>Telefone:</strong> {reservation.clientPhone || reservation.userPhone ? formatPhone(reservation.clientPhone || reservation.userPhone) : 'N/A'}
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
            <strong>Nº Reserva:</strong> {reservation.reservationNumber || 'N/A'}
          </div>
          <div className={styles.detailItem}>
            <strong>Pacote:</strong> {reservation.travelPackageName || reservation.packageName || 'N/A'}
          </div>
          <div className={styles.detailItem}>
            <strong>Destino:</strong> {reservation.travelPackageDestination || 'N/A'}
          </div>
          <div className={styles.detailItem}>
            <strong>Data da Reserva:</strong> {formatReservationDate(reservation.reservationDate || reservation.reservationDateFormatted)}
          </div>
          
          {/* Lista de Viajantes */}
          <div className={styles.detailItem}>
            <strong>Viajantes:</strong>
            {reservation.traveler && reservation.traveler.length > 0 ? (
              <div className={styles.travelersContainer}>
                {reservation.traveler.map((traveler, index) => (
                  <div key={traveler.id || index} className={styles.travelerItem}>
                    <div className={styles.travelerInfo}>
                      <span className={styles.travelerName}>
                        {index + 1}. {traveler.name}
                      </span>
                      <span className={styles.travelerDoc}>
                        RG: {traveler.rg || 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span>Nenhum viajante cadastrado</span>
            )}
          </div>

          <div className={styles.detailItem}>
            <strong>Status de Pagamento:</strong> 
            <span className={getStatusBadgeClass(reservation.paymentStatus || reservation.statusPayment)}>
              {reservation.paymentStatus || reservation.statusPayment}
            </span>
          </div>
          <div className={styles.detailItem}>
            <strong>Valor Total:</strong> 
            <span className={styles.priceCell}>
              {formatCurrency(reservation.totalValue || reservation.travelPackageValue || reservation.totalPrice || 0)}
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
