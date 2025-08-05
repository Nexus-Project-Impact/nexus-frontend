import React from 'react';
import { useParams } from 'react-router-dom';
import { usePackageEdit } from '../../hooks/usePackageEdit';
import styles from './AdminEditPackage.module.css';
import { Link } from 'react-router-dom';

export function AdminEditPackage() {
  const { id } = useParams();
  const { packageData, isLoading, isFetching, handleChange, handleSubmit } = usePackageEdit(id);

  // Lidar com o estado de carregamento inicial
  if (isFetching) {
    return <div className={styles.pageContainer}><p>Carregando dados do pacote...</p></div>;
  }

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.pageContainer}>
        <h2>Editar Pacote</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Título</label>
            <input 
              id="title" 
              name="title" 
              type="text" 
              placeholder="ex: Roteiro Cultural em Salvador"
              value={packageData.title} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Descrição</label>
            <textarea 
              id="description" 
              name="description" 
              placeholder="ex: Explore a cultura baiana em um pacote de 7 dias com city tour"
              value={packageData.description} 
              onChange={handleChange} 
              rows="3"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="destination">Destino</label>
            <input 
              id="destination" 
              name="destination" 
              type="text" 
              placeholder="ex: Salvador, BA"
              value={packageData.destination} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="duration">Duração (dias)</label>
            <input 
              id="duration" 
              name="duration" 
              type="number" 
              placeholder="ex: 7"
              value={packageData.duration} 
              onChange={handleChange} 
              min="1"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="departureDate">Data de Ida</label>
            <input 
              id="departureDate" 
              name="departureDate" 
              type="datetime-local" 
              value={packageData.departureDate} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="returnDate">Data de Retorno</label>
            <input 
              id="returnDate" 
              name="returnDate" 
              type="datetime-local" 
              value={packageData.returnDate} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="value">Preço</label>
            <input 
              id="value" 
              name="value" 
              type="number" 
              step="0.01"
              placeholder="ex: 3590.00"
              value={packageData.value} 
              onChange={handleChange} 
              min="0"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Nova Imagem (opcional)</label>
            <input 
              id="image" 
              name="image" 
              type="file" 
              accept="image/*"
              onChange={handleChange} 
            />
            <small>Deixe em branco para manter a imagem atual</small>
          </div>

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
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