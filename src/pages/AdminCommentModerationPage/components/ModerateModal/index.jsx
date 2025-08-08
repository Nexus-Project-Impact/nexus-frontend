import React, { useState, useEffect } from 'react';
import styles from './ModerateModal.module.css';

export function ModerateModal({ isOpen, onClose, onSave, reviewId, currentComment }) {
  const [editedComment, setEditedComment] = useState('');
  const [moderationReason, setModerationReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEditedComment(currentComment || '');
      setModerationReason('');
    }
  }, [isOpen, currentComment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!moderationReason.trim()) {
      alert('Por favor, informe a razão da moderação.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await onSave(reviewId, {
        newComment: editedComment,
        moderationReason: moderationReason.trim()
      });
      onClose();
    } catch (error) {
      console.error('Erro ao moderar comentário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Moderar Comentário</h2>
          <button 
            className={styles.closeButton} 
            onClick={handleClose}
            disabled={isLoading}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="comment" className={styles.label}>
              Novo Comentário (ID da Avaliação: {reviewId})
            </label>
            <textarea
              id="comment"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              className={styles.textarea}
              rows={4}
              placeholder="Digite o comentário moderado..."
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reason" className={styles.label}>
              Razão da Moderação *
            </label>
            <textarea
              id="reason"
              value={moderationReason}
              onChange={(e) => setModerationReason(e.target.value)}
              className={`${styles.textarea} ${styles.small}`}
              rows={3}
              placeholder="Ex: Linguagem inadequada, informações incorretas, etc..."
              disabled={isLoading}
              required
            />
            <small className={styles.fieldHelp}>
              Informe o motivo pelo qual este comentário está sendo moderado
            </small>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Moderação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
