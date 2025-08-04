import React from 'react';
import styles from '../review.module.css'; // Crie um CSS module similar ao do login

export function ReviewForm({
  destination,
  dateRange,
  packageImage,
  rating,
  setRating,
  comment,
  setComment,
  isLoading,
  error,
  onSubmit,
  onClose,
  isFromReservation = false
}) {
  return (
    <div className={styles.reviewContainer}>
      <div className={styles.header}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>Avalie a sua experiência</h2>
        {isFromReservation && (
          <p className={styles.fromReservationNote}>
            Você está avaliando esta viagem a partir das suas reservas
          </p>
        )}
      </div>
      
      <div className={styles.infoSection}>
        {packageImage && (
          <div className={styles.packageImageContainer}>
            <img 
              src={packageImage} 
              alt={destination}
              className={styles.packageImage}
            />
          </div>
        )}
        <div className={styles.packageDetails}>
          <div className={styles.infoItem}>
            <span>Destino: </span>
            <strong>{destination}</strong>
          </div>
          <div className={styles.infoItem}>
            <span>Data: </span>
            <span>{dateRange}</span>
          </div>
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