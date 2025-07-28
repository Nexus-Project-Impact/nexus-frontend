import React from 'react';
import styles from '../review.module.css'; // Crie um CSS module similar ao do login

export function ReviewForm({
  destination,
  dateRange,
  rating,
  setRating,
  comment,
  setComment,
  isLoading,
  error,
  onSubmit,
  onClose,
}) {
  return (
    <div className={styles.reviewContainer}>
      <button className={styles.closeButton} onClick={onClose}>×</button>
      <h2>Avalie a sua experiência</h2>
      <div className={styles.infoSection}>
        <div>
          <span>Destino: </span>
          <strong>{destination}</strong>
        </div>
        <div>
          <span>Data: </span>
          <span>{dateRange}</span>
        </div>
      </div>
      <form className={styles.formSection} onSubmit={onSubmit}>
        <label className={styles.ratingLabel}>
          Qual o seu nível de satisfação nesta viagem?
        </label>
        <div className={styles.ratingGroup}>
          {[...Array(11).keys()].map((num) => (
            <label key={num} className={styles.ratingItem}>
              <input
                type="radio"
                name="rating"
                value={num}
                checked={rating === num}
                onChange={() => setRating(num)}
                required
                disabled={isLoading}
              />
              <span>{num}</span>
            </label>
          ))}
        </div>
        <label htmlFor="comment" className={styles.commentLabel}>
          Deixe seu comentário
        </label>
        <textarea
          id="comment"
          placeholder="Escreva aqui (opcional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={styles.commentBox}
          disabled={isLoading}
        />
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Avaliar'}
        </button>
        {error && <p className={styles.errorText}>{error}</p>}
      </form>
    </div>
  );
}