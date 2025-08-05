import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PackagesTable.module.css';

// A tabela recebe os pacotes e uma função para lidar com a exclusão
export function PackagesTable({ packages, onDelete }) {
  // Verificação de segurança
  if (!packages || !Array.isArray(packages)) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Não foi possível carregar os dados dos pacotes.</p>
      </div>
    );
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Destino</th>
          <th>Data</th>
          <th>Voo</th>
          <th>Hotel</th>
          <th>Preço</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {packages.map((pkg) => (
          <tr key={pkg.id}>
            <td>{pkg.id}</td>
            <td>{pkg.name || 'N/A'}</td>
            <td>{pkg.dates || pkg.departureDate || 'N/A'}</td>
            <td>
              {pkg.detailsPackage?.flight?.company || pkg.description?.flight?.company || 'N/A'} - 
              Ida: {pkg.detailsPackage?.flight?.departureTime || pkg.description?.flight?.departureTime || 'N/A'} | 
              Volta: {pkg.detailsPackage?.flight?.returnTime || pkg.description?.flight?.returnTime || 'N/A'}
            </td>
            <td>{pkg.detailsPackage?.hotel?.name || pkg.description?.hotel?.name || 'N/A'}</td>
            <td>R$ {pkg.pricePackage?.toLocaleString('pt-BR') || pkg.price?.toLocaleString('pt-BR') || 'N/A'}</td>
            <td className={styles.actions}>
              <Link to={`/admin/pacotes/editar/${pkg.id}`} className={styles.actionLink}>Editar</Link>
              <button onClick={() => onDelete(pkg.id)} className={`${styles.actionLink} ${styles.deleteButton}`}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}