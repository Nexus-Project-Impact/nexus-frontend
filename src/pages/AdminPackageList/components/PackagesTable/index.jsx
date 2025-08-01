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
            <td>{pkg.id}</td>
            <td>{pkg.name}</td>
            <td>{pkg.dates}</td>
            <td>{pkg.detailsPackage.flight.company} - Ida: {pkg.detailsPackage.flight.departureTime} | Volta: {pkg.detailsPackage.flight.returnTime}</td>
            <td>{pkg.detailsPackage.hotel.name}</td>
            <td>R$ {pkg.pricePackage.toLocaleString('pt-BR')}</td>
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