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

  const handleClear = () => {
    setDestination('');
    setDateRange([null, null]);
    setPrice('');
    // Chama a busca com filtros vazios
    onSearch({ destination: '', dateRange: [null, null], price: '' });
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
            placeholderText="Data da viagem"
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
          <svg xmlns="http://www.w3.org/2000/svg" 
                xmlns:xlink="http://www.w3.org/1999/xlink" 
                enable-background="new 0 0 32 32" id="Glyph" width='30px' height="30px"
                version="1.1" viewBox="0 0 32 32" xml:space="preserve">
                <path fill="white" d="M27.414,24.586l-5.077-5.077C23.386,17.928,24,16.035,24,14c0-5.514-4.486-10-10-10S4,8.486,4,14  s4.486,10,10,10c2.035,0,3.928-0.614,5.509-1.663l5.077,5.077c0.78,0.781,2.048,0.781,2.828,0  C28.195,26.633,28.195,25.367,27.414,24.586z M7,14c0-3.86,3.14-7,7-7s7,3.14,7,7s-3.14,7-7,7S7,17.86,7,14z" id="XMLID_223_"/></svg>
        </button>
        <button type="button" onClick={handleClear} className={styles.clearButton}>
          Limpar
        </button>
      </form>
    </div>
  );
}