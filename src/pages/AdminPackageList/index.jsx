import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import packageService from '../../services/packageService';
import { PackagesTable } from './components/PackagesTable';
import { AdminSearchBar } from './components/AdminSearchBar';
import styles from './AdminPackageList.module.css';

export default function AdminPackageListPage() {
  const [allPackages, setAllPackages] = useState([]); // Todos os pacotes originais
  const [filteredPackages, setFilteredPackages] = useState([]); // Pacotes filtrados
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const fetchPackages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await packageService.getAllActive();
      // Garantir que data é um array
      const packagesArray = Array.isArray(data) ? data : [];
      setAllPackages(packagesArray);
      setFilteredPackages(packagesArray); // Inicialmente mostra todos
    } catch (err) {
      console.error('Erro ao carregar pacotes:', err);
      setError('Erro ao carregar pacotes. Tente novamente.');
      setAllPackages([]);
      setFilteredPackages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    // Buscar informações do pacote para mostrar na confirmação
    const packageToDelete = allPackages.find(pkg => pkg.id === id);
    const packageName = packageToDelete?.title || packageToDelete?.name || `Pacote ID: ${id}`;
    
    // Pede confirmação antes de excluir com nome do pacote
    const confirmMessage = `Tem certeza que deseja excluir o pacote "${packageName}"?\n\nEsta ação não pode ser desfeita.`;
    
    if (window.confirm(confirmMessage)) {
      setDeletingId(id); // Marca este ID como sendo excluído
      
      try {
        console.log(`Excluindo pacote com ID: ${id}`);
        await packageService.deletePackage(id);
        
        // Feedback de sucesso
        alert(`Pacote "${packageName}" excluído com sucesso!`);
        
        // Atualiza a lista de pacotes após a exclusão
        await fetchPackages();
      } catch (err) {
        console.error('Erro ao excluir pacote:', err);
        console.error('Erro completo:', {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          url: err.config?.url,
          method: err.config?.method
        });
        
        // Tratamento de erro mais específico
        let errorMessage = 'Erro ao excluir pacote. Tente novamente.';
        
        if (err.response?.status === 404) {
          errorMessage = 'Pacote não encontrado. Pode já ter sido excluído.';
        } else if (err.response?.status === 403) {
          errorMessage = 'Você não tem permissão para excluir este pacote.';
        } else if (err.response?.status === 409) {
          errorMessage = 'Não é possível excluir este pacote pois ele possui reservas associadas.';
        } else if (err.response?.status === 500) {
          if (err.response?.data?.message?.includes('entity changes')) {
            errorMessage = 'O backend precisa ser configurado para permitir exclusão mantendo as referências nas reservas e avaliações. Configure DeleteBehavior.NoAction no Entity Framework.';
          } else {
            errorMessage = 'Erro interno do servidor. O backend precisa permitir exclusão de pacotes mantendo referências existentes.';
          }
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response?.data?.errors) {
          errorMessage = `Erro de validação: ${Object.values(err.response.data.errors).flat().join(', ')}`;
        }
        
        alert(errorMessage);
      } finally {
        setDeletingId(null); // Remove o estado de loading
      }
    }
  };

  // Função para aplicar filtros
  const handleSearch = (filters) => {
    setIsLoading(true);
    let results = [...allPackages];
    let hasFilters = false;

    // Filtro por destino
    if (filters.destination && filters.destination.trim() !== '') {
      hasFilters = true;
      results = results.filter((pkg) =>
        (pkg.destination || '').toLowerCase().includes(filters.destination.toLowerCase())
      );
    }

    // Filtro por data
    if (filters.dateRange && filters.dateRange[0] !== null && filters.dateRange[1] !== null) {
      hasFilters = true;
      const [startDate, endDate] = filters.dateRange;
      results = results.filter((pkg) => {
        if (!pkg.departureDate) return false;
        const pkgDate = new Date(pkg.departureDate);
        return pkgDate >= startDate && pkgDate <= endDate;
      });
    }

    // Filtro por preço
    if (filters.price && filters.price !== '') {
      hasFilters = true;
      if (filters.price === '10000+') {
        results = results.filter((pkg) => {
          const pkgValue = pkg.value || pkg.price || pkg.pricePackage || 0;
          return pkgValue >= 10000;
        });
      } else {
        const [minValue, maxValue] = filters.price.split('-').map(Number);
        results = results.filter((pkg) => {
          const pkgValue = pkg.value || pkg.price || pkg.pricePackage || 0;
          return pkgValue >= minValue && pkgValue <= maxValue;
        });
      }
    }

    setHasActiveFilters(hasFilters);
    setFilteredPackages(results);
    setIsLoading(false);
  };

  // Função para limpar filtros
  const handleClearFilters = () => {
    setFilteredPackages(allPackages);
    setHasActiveFilters(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Pacotes</h1>
      
      {/* Barra de Filtros */}
      <AdminSearchBar 
        onSearch={handleSearch} 
        onClear={handleClearFilters}
      />

      {/* Indicador de filtros ativos */}
      {hasActiveFilters && (
        <div className={styles.filterIndicator}>
          <p>Mostrando {filteredPackages.length} de {allPackages.length} pacotes</p>
        </div>
      )}

      {isLoading ? (
        <p>Carregando pacotes...</p>
      ) : error ? (
        <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
          <p>{error}</p>
          <button onClick={fetchPackages} style={{ marginTop: '10px', padding: '10px 20px' }}>
            Tentar novamente
          </button>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          {hasActiveFilters ? (
            <p>Nenhum pacote encontrado com os filtros aplicados.</p>
          ) : (
            <p>Nenhum pacote encontrado.</p>
          )}
        </div>
      ) : (
        <PackagesTable packages={filteredPackages} onDelete={handleDelete} deletingId={deletingId} />
      )}

      <div className={styles.addButtonContainer}>
        <Link to="/admin/pacotes/add" className={styles.addButton}>
          Adicionar pacote
        </Link>
      </div>
    </div>
  );
}