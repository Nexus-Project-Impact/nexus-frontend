import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PackagesTable.module.css';

// A tabela recebe os pacotes e uma função para lidar com a exclusão
export function PackagesTable({ packages, onDelete, deletingId }) {
  // Verificação de segurança
  if (!packages || !Array.isArray(packages)) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Não foi possível carregar os dados dos pacotes.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Destino</th>
            <th>Data de Ida</th>
            <th>Data de Retorno</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg.id}>
              <td>{pkg.id || 'N/A'}</td>
              <td>{pkg.title || pkg.name || 'N/A'}</td>
              <td>{pkg.destination || pkg.destino || 'N/A'}</td>
              <td>{pkg.departureDate ? new Date(pkg.departureDate).toLocaleDateString('pt-BR') : 'N/A'}</td>
              <td>{pkg.returnDate ? new Date(pkg.returnDate).toLocaleDateString('pt-BR') : 'N/A'}</td>
              <td className={styles.descriptionCell} title={pkg.description || pkg.details || 'N/A'}>
                {pkg.description || pkg.details || 'N/A'}
              </td>
              <td className={styles.priceCell}>
                R$ {pkg.price || pkg.pricePackage || pkg.value ?
                  (pkg.price || pkg.pricePackage || pkg.value).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }) : 'N/A'}
              </td>
              <td>
                <div className={styles.actions}>
                  <Link to={`/admin/pacotes/editar/${pkg.id}`} className={styles.actionLink}>Editar</Link>
                  <button
                    onClick={() => onDelete(pkg.id)}
                    className={`${styles.actionLink} ${styles.deleteButton}`}
                    disabled={deletingId === pkg.id}
                  >
                    {deletingId === pkg.id ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}