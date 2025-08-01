import React from 'react';
import { useParams } from 'react-router-dom';
import { usePackageEdit } from './hooks/usePackageEdit.js';
import styles from './AdminEditPackage.module.css';

export function AdminEditPackage() {
  const { id } = useParams();
  const { packageData, isLoading, isFetching, handleChange, handleSubmit, setPackageData } = usePackageEdit(id);

  // Lidar com o estado de carregamento inicial
  if (isFetching) {
    return <div className={styles.pageContainer}><p>Carregando dados do pacote...</p></div>;
  }

  // Criar um manipulador específico para o preço
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPackageData(prev => ({
      ...prev,
      price: {
        ...prev.price,
        [name]: parseFloat(value) || 0
      }
    }));
  };

  return (
    <div className={styles.pageContainer}>
      
      <h2>Editar Pacote</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* ... outros inputs ... */}
        <div className={styles.formGroup}>
          <label htmlFor="name">Nome do Destino</label>
          <input 
            id="name" 
            name="name" 
            type="text" 
            value={packageData.name || ''} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="image">URL da Imagem Principal</label>
          <input 
            id="image" 
            name="image" 
            type="url" 
            value={packageData.image || ''} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="dates">Datas</label>
          <input 
            placeholder="ex: 10 out. 2025 à 15 out. 2025" 
            id="dates" 
            name="dates" 
            type="text" 
            value={packageData.dates || ''} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="current">Preço Atual</label>
          <input 
            placeholder="ex: 4379.00" 
            id="current" 
            name="current" 
            type="number" 
            value={packageData.price?.current || ''} 
            onChange={handlePriceChange} 
            required 
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="flight">Voo</label>
          <input 
            placeholder="ex: Azul - Ida: 07:35 | Volta: 07:35" 
            id="flight" 
            name="flight" 
            type="text" 
            value={packageData.flight || ''} 
            onChange={handleChange} 
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="hotel">Hotel</label>
          <input 
            id="hotel" 
            name="hotel" 
            type="text" 
            value={packageData.hotel || ''} 
            onChange={handleChange} 
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Pacote'}
        </button>
      </form>
    </div>
  );
}