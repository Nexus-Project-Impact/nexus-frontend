import React, { useState, useEffect } from 'react';
import { getComments, deleteCommentById } from '../../services/commentService';
import { CommentsTable } from './components/CommentsTable';
import styles from './AdminCommentModerationPage.module.css';

export default function AdminCommentModerationPage() {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = async () => {
    setIsLoading(true);
    const data = await getComments();
    setComments(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este comentário? A ação não pode ser desfeita.')) {
      await deleteCommentById(id);
      // Atualiza a lista após a exclusão
      fetchComments();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Comentários</h1>
      
      {isLoading ? (
        <p>Carregando comentários...</p>
      ) : (
        <CommentsTable comments={comments} onDelete={handleDelete} />
      )}
    </div>
  );
}