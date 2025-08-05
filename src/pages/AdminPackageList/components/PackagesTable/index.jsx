import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PackagesTable.module.css';

// A tabela recebe os pacotes e uma função para lidar com a exclusão
export function PackagesTable({ packages, onDelete }) {
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
            <td>{pkg.id || 'N/A'}</td>
            <td>{pkg.name || 'N/A'}</td>
            <td>{pkg.dates || 'N/A'}</td>
            <td>
              {pkg.detailsPackage?.flight?.company || 'N/A'} - 
              Ida: {pkg.detailsPackage?.flight?.departureTime || 'N/A'} | 
              Volta: {pkg.detailsPackage?.flight?.returnTime || 'N/A'}
            </td>
            <td>{pkg.detailsPackage?.hotel?.name || 'N/A'}</td>
            <td>R$ {pkg.pricePackage ? pkg.pricePackage.toLocaleString('pt-BR') : '0'}</td>
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