import React from 'react';
import styles from './CommentsTable.module.css';

export function CommentsTable({ comments, onDelete, onModerate }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Pacote</th>
          <th>Cliente</th>
          <th>Avaliação</th>
          <th className={styles.commentColumn}>Comentário</th>
          <th>Data</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {comments.map((review) => (
          <tr key={review.id}>
            <td>{review.id}</td>
            <td>
              {review.packageName || `Pacote ID: ${review.travelPackageId || review.packageId || 'N/A'}`}
            </td>
            <td>
              {review.userName || 
               review.clientName || 
               review.user?.name || 
               review.user?.nome || 
               review.client?.name || 
               review.client?.nome ||
               `Usuário ID: ${review.userId || review.clientId || 'N/A'}`}
            </td>
            <td>
              <div className={styles.ratingContainer}>
                <span className={styles.ratingStars}>
                  {[...Array(10)].map((_, i) => (
                    <span 
                      key={i} 
                      className={i < (review.rating || 0) ? styles.starFilled : styles.starEmpty}
                    >
                      ★
                    </span>
                  ))}
                </span>
                <span className={styles.ratingText}>({review.rating || 0}/10)</span>
              </div>
            </td>
            <td className={styles.commentCell}>
              {review.comment || <em className={styles.noComment}>Sem comentário</em>}
            </td>
            <td>
              {review.createdAt ? 
                new Date(review.createdAt).toLocaleDateString('pt-BR') : 
                review.date ? 
                  new Date(review.date).toLocaleDateString('pt-BR') : 
                  'N/A'
              }
            </td>
            <td className={styles.actions}>
              <button 
                onClick={() => onModerate(review.id, review.comment || '')} 
                className={styles.actionLink}
                title="Moderar comentário"
              >
                Moderar
              </button>
              <button 
                onClick={() => onDelete(review.id)} 
                className={`${styles.actionLink} ${styles.deleteButton}`}
                title="Excluir avaliação"
              >
                Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}