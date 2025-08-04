import React from 'react';
import { usePackage } from '../../hooks/usePackage';
import styles from './AdminPackage.module.css';
import { Link } from 'react-router-dom';

export function AdminPackage() {
  const { packageData, isLoading, handleChange, handleSubmit } = usePackage();

  return (
  <div className={styles.detailsContainer}>
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
          <label htmlFor="dates">Datas</label>
          <input placeholder="ex: 10 out. 2025 à 15 out. 2025" id="dates" name="dates" type="text" value={packageData.dates} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="price">Preço</label>
          <input placeholder="ex: 4379.00"id="price" name="price" type="number" value={packageData.price} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="flight">Voo</label>
          <input placeholder="ex: Azul - Ida: 07:35 | Volta: 07:35" id="flight" name="flight" type="text" value={packageData.flight} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="hotel">Hotel</label>
          <input id="hotel" name="hotel" type="text" value={packageData.hotel} onChange={handleChange} required />
        </div>

        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Pacote'}
        </button>
      </form>
    </div>
    <div className={styles.buttonContainer}>
      <Link to="/admin/pacotes" className={styles.actionLink}>
        Voltar para Pacotes
      </Link>
    </div>
  </div>
  );
}