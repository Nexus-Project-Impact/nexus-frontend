import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import packageService from '../../services/packageService';
import { PackagesTable } from './components/PackagesTable';
import styles from './AdminPackageList.module.css';

export default function AdminPackageListPage() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPackages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await packageService.getPackages();
      console.log('Pacotes carregados:', data);
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
    // Pede confirmação antes de excluir
    if (window.confirm('Tem certeza que deseja excluir este pacote?')) {
      try {
        await packageService.deletePackage(id);
        // Atualiza a lista de pacotes após a exclusão
        fetchPackages();
      } catch (err) {
        console.error('Erro ao excluir pacote:', err);
        alert('Erro ao excluir pacote. Tente novamente.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Pacotes</h1>
      
      {/* Barra de Pesquisa (funcionalidade a ser adicionada) */}
      <div className={styles.searchBar}>
        <input type="text" placeholder="Destino" />
        <input type="text" placeholder="09/08 - 09/09" />
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
        <PackagesTable packages={packages} onDelete={handleDelete} />
      )}

      <div className={styles.addButtonContainer}>
        <Link to="/admin/pacotes/add" className={styles.addButton}>
          Adicionar pacote
        </Link>
      </div>
    </div>
  );
}