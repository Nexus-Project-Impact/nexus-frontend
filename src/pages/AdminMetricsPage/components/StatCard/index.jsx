import React from 'react';
import styles from './StatCard.module.css';

export function StatCard({ title, value, isCurrency = false }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.value}>
        {isCurrency && 'R$ '}
        {isCurrency ? value.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : value}
      </p>
    </div>
  );
}

// Crie também o CSS para ele: StatCard.module.css
/*
.card { background-color: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center; }
.title { margin: 0 0 10px 0; color: #666; font-size: 1rem; }
.value { margin: 0; color: #333; font-size: 2.5rem; font-weight: bold; }
*/