import React from 'react';
import { usePackage } from './hooks/usePackage.js';
import styles from './AdminPackage.module.css';

export function AdminPackage() {
  const { packageData, isLoading, handleChange, handleSubmit } = usePackage();

  return (
    <div className={styles.pageContainer}>
      <h2>Adicionar Novo Pacote</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nome do Destino</label>
          <input id="name" name="name" type="text" value={packageData.name} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="image">URL da Imagem Principal</label>
          <input id="image" name="image" type="url" value={packageData.image} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="dates">Datas (ex: 10 out. 2025 à 15 out. 2025)</label>
          <input id="dates" name="dates" type="text" value={packageData.dates} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="price">Preço (somente números)</label>
          <input id="price" name="price" type="number" value={packageData.price} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="details">Detalhes (Voo + Hotel)</label>
          <textarea id="details" name="details" value={packageData.details} onChange={handleChange} rows="4" required></textarea>
        </div>

        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Pacote'}
        </button>
      </form>
    </div>
  );
}