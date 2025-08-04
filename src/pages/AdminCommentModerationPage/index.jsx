import React, { useState, useEffect } from 'react';
import reviewService from '../../services/reviewService';
import { CommentsTable } from './components/CommentsTable';
import styles from './AdminCommentModerationPage.module.css';

export default function AdminCommentModerationPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const data = await reviewService.getAll();
      setReviews(data);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta avaliação? A ação não pode ser desfeita.')) {
      try {
        await reviewService.delete(id);
        // Atualiza a lista após a exclusão
        fetchReviews();
      } catch (error) {
        console.error('Erro ao excluir avaliação:', error);
        alert('Erro ao excluir avaliação. Tente novamente.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Avaliações</h1>
      
      {isLoading ? (
        <p>Carregando avaliações...</p>
      ) : reviews.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhuma avaliação encontrada.</p>
        </div>
      ) : (
        <CommentsTable comments={reviews} onDelete={handleDelete} />
      )}
    </div>
  );
}