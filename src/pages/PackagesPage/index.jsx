import React, { useState, useEffect } from 'react';
import { PackageGrid } from './components/PackageGrid';
import { getPackages } from '../../services/packageService';
import { SearchBar } from './components/SearchBar';
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
        const data = await getPackages();
        setAllPackages(data);
        setFilteredPackages(data);
      } catch (err) {
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
        {/* 3. Adicione a SearchBar aqui e passe a função de busca */}
        <div className={styles.searchBarWrapper}>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <div className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>Seu novo destino está aqui!</h2>
        
        {isLoading && <p>Carregando...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {!isLoading && !error && filteredPackages.length > 0 && (
          <PackageGrid packages={filteredPackages} />
        )}
        
        {!isLoading && !error && filteredPackages.length === 0 && (
          <p>Nenhum pacote encontrado com os critérios de busca.</p>
        )}

        {/* ... botão de mostrar mais ... */}
      </div>
    </div>
  );
}