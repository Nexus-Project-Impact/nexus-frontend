import React, { useState, useEffect } from 'react';
import reviewService from '../../services/reviewService';
import { CommentsTable } from './components/CommentsTable';
import { ModerateModal } from './components/ModerateModal';
import styles from './AdminCommentModerationPage.module.css';

export default function AdminCommentModerationPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

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

  const handleModerate = (reviewId, currentComment) => {
    setSelectedReview({ id: reviewId, comment: currentComment });
    setIsModalOpen(true);
  };

  const handleSaveModeration = async (reviewId, moderationData) => {
    try {
      console.log('Iniciando moderação:', { reviewId, moderationData });
      
      // Chama o endpoint de moderação do review service
      await reviewService.moderate(reviewId, moderationData);
      
      console.log('Moderação realizada com sucesso');
      
      // Atualiza a lista após a moderação
      await fetchReviews();
      
      // Fecha o modal
      setIsModalOpen(false);
      setSelectedReview(null);
      
      alert('Comentário moderado com sucesso!');
    } catch (error) {
      console.error('Erro ao moderar comentário:', error);
      
      // Verificar se é erro de rede/servidor ou erro específico
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.response?.data || 
                          error.message || 
                          'Erro desconhecido ao moderar comentário';
      
      alert(`Erro ao moderar comentário: ${errorMessage}`);
      throw error; // Re-throw para que o modal possa lidar com o loading
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
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
        <CommentsTable 
          comments={reviews} 
          onDelete={handleDelete} 
          onModerate={handleModerate}
        />
      )}

      <ModerateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModeration}
        reviewId={selectedReview?.id}
        currentComment={selectedReview?.comment}
      />
    </div>
  );
}