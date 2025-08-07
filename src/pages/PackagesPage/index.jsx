import React, { useState, useEffect } from "react";
import { PackageGrid } from "./components/PackageGrid";
import packageService from "../../services/packageService"; // Supondo que você tenha um serviço para buscar pacotes
import { SearchBar } from "./components/SearchBar";
import styles from "./PackagesPage.module.css";

export function PackagesPage() {
  const [allPackages, setAllPackages] = useState([]); // Guarda todos os pacotes originais
  const [filteredPackages, setFilteredPackages] = useState([]); // Pacotes a serem exibidos
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        setIsLoading(true);

        const data = await packageService.getPackagesActive();
        const mappedPackages = data.map((pkg) => ({
          id: pkg.id,
          title: pkg.title || pkg.name,
          imageUrl: pkg.imageUrl || pkg.image,
          departureDate: pkg.departureDate,
          returnDate: pkg.returnDate,
          destination: pkg.destination || pkg.local,
          value: pkg.price || pkg.value,
        }));
        setAllPackages(mappedPackages);
        setFilteredPackages(mappedPackages);
      } catch (err) {
        console.error("Erro ao carregar pacotes:", err);
        setError("Falha ao carregar os pacotes.");
      } finally {
        setIsLoading(false);
      }
    };
    loadPackages();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  const handleSearch = (filters) => {
    setIsLoading(true);
    let results = [...allPackages];
    let hasFilters = false;

    if (filters.destination !== "") {
      hasFilters = true;
      results = results.filter((pkg) =>
        pkg.destination
          .toLowerCase()
          .includes(filters.destination.toLowerCase())
      );
    }

    if (filters.dateRange[0] !== null) {
      hasFilters = true;
      results = results.filter((pkg) => {
        const pkgDate = new Date(pkg.departureDate);
        return (
          pkgDate >= filters.dateRange[0] && pkgDate <= filters.dateRange[1]
        );
      });
    }

    if (filters.price !== "") {
      hasFilters = true;
      const [minValue, maxValue] = filters.price.split("-").map(Number);
      results = results.filter((pkg) => {
        const pkgValue = pkg.value;
        return pkgValue >= minValue && pkgValue <= maxValue;
      });
    }

    setHasActiveFilters(hasFilters);
    setFilteredPackages(results);
    setIsLoading(false);
  };

  return (
    <div className={styles.packageContainer}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Nexus</h1>
        {
          <div className={styles.searchBarWrapper}>
            <SearchBar onSearch={handleSearch} />
          </div>
        }
      </div>

      <div className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>Seu novo destino está aqui!</h2>

        {/* Indicador de filtros ativos */}
        {hasActiveFilters && (
          <div className={styles.filterIndicator}>
            <p>Mostrando {filteredPackages.length} de {allPackages.length} pacotes</p>
          </div>
        )}

        {isLoading && <p>Carregando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

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
