import React from 'react';
import styles from './PackageCard.module.css';
import { Link } from 'react-router-dom';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';


export function PackageCard({ packageData }) {
  const { id, title, imageUrl, departureDate, returnDate } = packageData;

const formatarData = (data) => {
    return format(new Date(data), "EEE d MMM yyyy", { locale: ptBR });
  };

  return (
    <div className={styles.cardContainerSpace}>
    <div className={styles.card}>
      <img src={imageUrl} alt={`Viagem para ${title}`} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDates}>
          {`${formatarData(departureDate)} - ${formatarData(returnDate)}`}
        </p>
        <p className={styles.cardInfo}>Voo + Hospedagem</p>
        <Link to={`/pacotes/${id}`} className={styles.cardButtonLink}>
        <button className={styles.cardButton}>Saiba Mais</button>
        </Link>
      </div>
    </div>
    </div>
  );
}