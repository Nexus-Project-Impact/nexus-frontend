import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';

import 'react-datepicker/dist/react-datepicker.css';
import styles from './AdminSearchBar.module.css';

export function AdminSearchBar({ onSearch, onClear }) {
  const [destination, setDestination] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [price, setPrice] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ destination, dateRange, price });
  };

  const handleClear = () => {
    setDestination('');
    setDateRange([null, null]);
    setPrice('');
    onClear();
  };

  return (
    <div className={styles.searchBarContainer}>
      <form className={styles.searchBar} onSubmit={handleSearch}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Filtrar por destino"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className={styles.inputField}
          />
        </div>
        
        <div className={`${styles.inputWrapper} ${styles.dateWrapper}`}>
          <FaCalendarAlt className={styles.icon} />
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            placeholderText="Período da viagem"
            dateFormat="dd/MM/yyyy"
            className={styles.datePicker}
            isClearable={true}
          />
        </div>
        
        <div className={styles.inputWrapper}>
          <select 
            value={price} 
            onChange={(e) => setPrice(e.target.value)}
            className={styles.selectField}
          >
            <option value="">Todas as faixas de preço</option>
            <option value="0-1000">Até R$1.000</option>
            <option value="1000-3000">R$1.000 - R$3.000</option>
            <option value="3000-5000">R$3.000 - R$5.000</option>
            <option value="5000-10000">R$5.000 - R$10.000</option>
            <option value="10000+">Acima de R$10.000</option>
          </select>
        </div>
        
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.searchButton} title="Buscar">
            <FaSearch />
          </button>
          <button 
            type="button" 
            onClick={handleClear} 
            className={styles.clearButton}
            title="Limpar filtros"
          >
            Limpar
          </button>
        </div>
      </form>
    </div>
  );
}
