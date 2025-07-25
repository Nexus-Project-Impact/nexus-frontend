import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa'; // Usando ícones

import 'react-datepicker/dist/react-datepicker.css'; // Estilos da biblioteca de data
import styles from './SearchBar.module.css';

export function SearchBar({ onSearch }) {
  const [destination, setDestination] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [price, setPrice] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ destination, dateRange, price });
  };

  return (
    <div className={styles.searchBarContainer}>
      <form className={styles.searchBar} onSubmit={handleSearch}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Adicionar destino"
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
            placeholderText="09/08 - 09/09"
            dateFormat="dd/MM"
            className={styles.datePicker}
            minDate={new Date()}
          />
        </div>
        <div className={styles.inputWrapper}>
          <select 
            value={price} 
            onChange={(e) => setPrice(e.target.value)}
            className={styles.selectField}
          >
            <option value="">Faixa de preço</option>
            <option value="0-3000">Até R$3.000</option>
            <option value="3000-5000">R$3.000 - R$5.000</option>
            <option value="5000-10000">R$5.000 - R$10.000</option>
            <option value="10000+">Acima de R$10.000</option>
          </select>
        </div>
        <button type="submit" className={styles.searchButton}>
          <FaSearch />
        </button>
      </form>
    </div>
  );
}