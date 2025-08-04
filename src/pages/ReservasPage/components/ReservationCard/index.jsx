import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ReservationCard.module.css';

export function ReservationCard({ reservation }) {
  const { packageName, date, status, totalPrice, image, id } = reservation;

  // Aplica uma classe de estilo baseada no status da reserva
  const statusClass = styles[status.toLowerCase()] || '';

  return (
    <div className={styles.card}>
      <img src={image} alt={packageName} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <h3 className={styles.packageName}>{packageName}</h3>
        <p><strong>Data:</strong> {date}</p>
        <p><strong>Status:</strong> <span className={`${styles.status} ${statusClass}`}>{status}</span></p>
        <p className={styles.price}>R$ {totalPrice.toLocaleString('pt-BR')}</p>
        <Link to={`/pacotes/${id}`} className={styles.detailsButton}>
          Ver Detalhes do Pacote
        </Link>
      </div>
    </div>
  );
}