import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import styles from './DateFilter.module.css';

export function DateFilter({ onDateChange, onError, exportActions }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    // Não chama onDateChange para evitar loading desnecessário
  };

  const handleApplyFilter = () => {
    // Validação: se uma data está preenchida, ambas devem estar
    if ((startDate && !endDate) || (!startDate && endDate)) {
      onError?.('Informe um período de datas válido!');
      return;
    }
    
    // Se chegou aqui, a validação passou
    onDateChange({ startDate, endDate });
  };

  return (
    <div className={styles.dateFilter}>
      <div className={styles.filterRow}>
        <div className={styles.leftSection}>
          <div className={styles.dateInputs}>
            <div className={styles.inputGroup}>
              <label htmlFor="startDate">Data Inicial:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={handleStartDateChange}
                className={styles.dateInput}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="endDate">Data Final:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={handleEndDateChange}
                className={styles.dateInput}
                min={startDate}
              />
            </div>
          </div>
          
          <div className={styles.filterActions}>
            <button 
              onClick={handleApplyFilter}
              className={styles.applyButton}
              title="Aplicar Filtro"
            >
              <FiSearch size={18} />
            </button>
            <button 
              onClick={handleClearFilter}
              className={styles.clearButton}
            >
              Limpar
            </button>
          </div>
        </div>
        
        {exportActions && (
          <div className={styles.exportActions}>
            {exportActions}
          </div>
        )}
      </div>
    </div>
  );
}
