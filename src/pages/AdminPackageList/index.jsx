import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import packageService from '../../services/packageService';
import { PackagesTable } from './components/PackagesTable';
import styles from './AdminPackageList.module.css';

export default function AdminPackageListPage() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchPackages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await packageService.getPackages();
      // Garantir que data é um array
      setPackages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar pacotes:', err);
      setError('Erro ao carregar pacotes. Tente novamente.');
      setPackages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    // Buscar informações do pacote para mostrar na confirmação
    const packageToDelete = packages.find(pkg => pkg.id === id);
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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Pacotes</h1>
      
      {/* Barra de Pesquisa (funcionalidade a ser adicionada) */}
      <div className={styles.searchBar}>
        <input type="text" placeholder="Destino" />
        <input type="date" placeholder="Data de Ida" />
        <input type="text" placeholder="ID do pacote" />
        <button className={styles.searchButton}>
          <svg xmlns="http://www.w3.org/2000/svg" 
          xmlnsXlink="http://www.w3.org/1999/xlink" 
          enableBackground="new 0 0 32 32" id="Glyph" width='30px' height="30px"
          version="1.1" viewBox="0 0 32 32" xmlSpace="preserve">
          <path fill="white" d="M27.414,24.586l-5.077-5.077C23.386,17.928,24,16.035,24,14c0-5.514-4.486-10-10-10S4,8.486,4,14  s4.486,10,10,10c2.035,0,3.928-0.614,5.509-1.663l5.077,5.077c0.78,0.781,2.048,0.781,2.828,0  C28.195,26.633,28.195,25.367,27.414,24.586z M7,14c0-3.86,3.14-7,7-7s7,3.14,7,7s-3.14,7-7,7S7,17.86,7,14z" id="XMLID_223_"/>
          </svg>
        </button>
      </div>

      {isLoading ? (
        <p>Carregando pacotes...</p>
      ) : error ? (
        <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
          <p>{error}</p>
          <button onClick={fetchPackages} style={{ marginTop: '10px', padding: '10px 20px' }}>
            Tentar novamente
          </button>
        </div>
      ) : packages.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Nenhum pacote encontrado.</p>
        </div>
      ) : (
        <PackagesTable packages={packages} onDelete={handleDelete} deletingId={deletingId} />
      )}

      <div className={styles.addButtonContainer}>
        <Link to="/admin/pacotes/add" className={styles.addButton}>
          Adicionar pacote
        </Link>
      </div>
    </div>
  );
}