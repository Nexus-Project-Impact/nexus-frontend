import React, { useState, useEffect } from 'react';
import { PackageGrid } from './components/PackageGrid';
import packageService from '../../services/packageService'; // Supondo que você tenha um serviço para buscar pacotes
import { SearchBar } from './components/SearchBar';
import { TestAPI } from '../../components/TestAPI';
import styles from './PackagesPage.module.css';

export function PackagesPage() {
  const [allPackages, setAllPackages] = useState([]); // Guarda todos os pacotes originais
  const [filteredPackages, setFilteredPackages] = useState([]); // Pacotes a serem exibidos
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        setIsLoading(true);

        const data = await packageService.getPackages();
        const mappedPackages = data.map(pkg => ({
          id: pkg.id,
          title: pkg.title || pkg.name,
          imageUrl: pkg.imageUrl || pkg.image,
          departureDate: pkg.departureDate,
          returnDate: pkg.returnDate
        }));
        setAllPackages(mappedPackages);
        setFilteredPackages(mappedPackages);
      } catch (err) {
        console.error('Erro ao carregar pacotes:', err);
        setError('Falha ao carregar os pacotes.');
      } finally {
        setIsLoading(false);
      }
    };
    loadPackages();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

const handleSearch = (filters) => {
    setIsLoading(true);
    let results = [...allPackages];

    if (filters.destination) {
      results = results.filter(pkg =>
        pkg.name.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }
    
    // Aqui você adicionaria a lógica para filtrar por data e preço
    // com base nos valores de `filters.dateRange` e `filters.price`
    
    setFilteredPackages(results);
    setIsLoading(false);
  };

  return (
    <div>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Nexus</h1>
        {<div className={styles.searchBarWrapper}>
          <SearchBar onSearch={handleSearch} />
        </div>}
        
      </div>

      <div className={styles.contentSection}>
        <TestAPI />
        
        <h2 className={styles.sectionTitle}>Seu novo destino está aqui!</h2>
        
        {isLoading && <p>Carregando...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {!isLoading && !error && filteredPackages.length > 0 && (
          <PackageGrid packages={filteredPackages} />
        )}
        
        {!isLoading && !error && filteredPackages.length === 0 && (
          <p>Nenhum pacote encontrado com os critérios de busca.</p>
        )}

        <div className={styles.showMoreContainer}>
          <button className={styles.showMoreButton}>Mostrar mais</button>
        </div>
      </div>
    </div>
  );
}