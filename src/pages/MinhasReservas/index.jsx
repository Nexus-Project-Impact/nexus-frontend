import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useUserReservations } from '../../hooks/useReservations';
import { notificationService } from '../../services/notificationService';
import styles from './MinhasReservas.module.css';

export function MinhasReservas() {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const { 
    reservations, 
    isLoading, 
    error, 
    markAsReviewed, 
    canReviewReservation 
  } = useUserReservations();

  useEffect(() => {
    // Verificar se está logado
    if (!token) {
      navigate('/login');
      return;
    }
  }, [token, navigate]);

  const handleReviewClick = async (reservationId, packageId) => {
    try {
      // Verificar se pode avaliar esta reserva específica
      const canReview = await canReviewReservation(reservationId);
      
      if (!canReview) {
        notificationService.review.createError('Você já avaliou esta reserva ou ela ainda não está elegível para avaliação.');
        return;
      }

      // Navegar para a página de adicionar avaliação
      navigate(`/avaliar/${packageId}`, { 
        state: { 
          reservationId, 
          fromReservations: true 
        } 
      });
    } catch (err) {
      console.error('Erro ao verificar permissão de avaliação:', err);
      // Em caso de erro, permite navegar para avaliação
      navigate(`/avaliar/${packageId}`, { 
        state: { 
          reservationId, 
          fromReservations: true 
        } 
      });
    }
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      'confirmada': { text: 'Confirmada', class: 'confirmed' },
      'finalizada': { text: 'Finalizada', class: 'finished' },
      'cancelada': { text: 'Cancelada', class: 'cancelled' }
    };
    return statusMap[status] || { text: status, class: 'default' };
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Minhas Reservas</h1>
        <div className={styles.loading}>Carregando suas reservas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Minhas Reservas</h1>
        <div className={styles.error}>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className={styles.retryButton}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Minhas Reservas</h1>

      {reservations.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>Nenhuma reserva encontrada</h3>
          <p>Que tal explorar nossos destinos incríveis?</p>
          <button onClick={() => navigate('/pacotes')} className={styles.exploreButton}>
            Explorar Pacotes
          </button>
        </div>
      ) : (
        <div className={styles.reservationsList}>
          {reservations.map((reservation) => {
            return (
              <div key={reservation.id} className={styles.reservationCard}>
                <div className={styles.cardHeader}>
                  <img 
                    src={reservation.packageImage} 
                    alt={reservation.packageName}
                    className={styles.packageImage}
                  />
                  <div className={styles.packageInfo}>
                    <h3 className={styles.packageName}>{reservation.packageName}</h3>
                    <p className={styles.packageDates}>{reservation.dates}</p>
                  </div>
                  <div className={styles.cardActions}>
                    {reservation.status === 'finalizada' && !reservation.hasReview ? (
                      <button 
                        className={styles.reviewButton}
                        onClick={() => handleReviewClick(reservation.id, reservation.packageId)}
                      >
                        Avaliar Viagem
                      </button>
                    ) : reservation.hasReview ? (
                      <button className={styles.reviewedButton}>
                        ✓ Avaliado
                      </button>
                    ) : reservation.status === 'confirmada' ? (
                      <span className={styles.statusBadge}>
                        Viagem Confirmada
                      </span>
                    ) : (
                      <span className={`${styles.statusBadge} ${styles[getStatusDisplay(reservation.status).class]}`}>
                        {getStatusDisplay(reservation.status).text}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
