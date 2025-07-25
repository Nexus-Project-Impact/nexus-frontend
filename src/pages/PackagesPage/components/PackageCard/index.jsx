import React from 'react';
import styles from './PackageCard.module.css';
import { Link } from 'react-router-dom';

export function PackageCard({ packageData }) {
  const { id, name, image, details, dates } = packageData;

  return (
    <div className={styles.card}>
      <img src={image} alt={`Viagem para ${name}`} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{name}</h3>
        <p className={styles.cardInfo}>{dates}</p>
        <p className={styles.cardInfo}>{details}</p>
        <Link to={`/pacotes/${id}`} className={styles.cardButtonLink}>
        <button className={styles.cardButton}>Saiba Mais</button>
        </Link>
      </div>
    </div>
  );
}