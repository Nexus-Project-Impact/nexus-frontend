import React from 'react';
import styles from './CommentsTable.module.css';

export function CommentsTable({ comments, onDelete }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID Reserva</th>
          <th>Destino</th>
          <th>Cliente</th>
          <th className={styles.commentColumn}>Comentário</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {comments.map((comment) => (
          <tr key={comment.id}>
            <td>{comment.reservationId}</td>
            <td>{comment.destination}</td>
            <td>{comment.customerName} (ID: {comment.customerId})</td>
            <td>{comment.commentText}</td>
            <td>
              <button onClick={() => onDelete(comment.id)} className={styles.deleteButton}>
                Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}