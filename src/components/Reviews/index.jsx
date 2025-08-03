import React from 'react';
import { useReview } from '../../hooks/useReview';
import './ReviewModal.modal.css';

export function Reviews({ packageId }) {
  const {
    reviews,
    stats,
    isLoading,
    error
  } = useReview(packageId);

  const renderStars = (rating) => {
    const stars = [];
    
    for (let i = 1; i <= 10; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="starFilled">★</span>);
      } else {
        stars.push(<span key={i} className="starEmpty">★</span>);
      }
    }
    
    return stars;
  };

  if (isLoading) {
    return <div className="reviewsContainer">Carregando avaliações...</div>;
  }

  if (error) {
    return <div className="reviewsContainer">Erro ao carregar avaliações: {error}</div>;
  }

  return (
    <div className="reviewsContainer">
      <div className="reviewsHeader">
        <h3>Avaliações dos Viajantes</h3>
        {stats.totalReviews > 0 && (
          <div className="averageRating">
            <span className="ratingNumber">{stats.averageRating.toFixed(1)}</span>
            <div className="stars">
              {renderStars(Math.round(stats.averageRating))}
            </div>
            <span className="reviewCount">({stats.totalReviews} avaliações)</span>
          </div>
        )}
      </div>

      {stats.totalReviews === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>Ainda não há avaliações para este destino.</p>
        </div>
      ) : (
        <div className="reviewsList">
          {reviews.map((review) => (
            <div key={review.id} className="reviewItem">
              <div className="reviewHeader">
                <span className="userName">{review.userName || review.clientName}</span>
                <span className="reviewDate">{new Date(review.createdAt || review.date).toLocaleDateString('pt-BR')}</span>
              </div>
              
              <div className="reviewRating">
                <div className="stars">
                  {renderStars(review.rating)}
                </div>
                <span className="ratingText">({review.rating}/10)</span>
              </div>
              
              <p className="reviewComment">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}