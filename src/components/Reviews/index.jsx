import React from 'react';
import { useReviews } from './hooks/useReviews';
import './ReviewModal.modal.css';

export function Reviews({ packageId }) {
  const {
    reviews,
    averageRating,
    isLoading,
    totalReviews
  } = useReviews(packageId);

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

  return (
    <div className="reviewsContainer">
      <div className="reviewsHeader">
        <h3>Avaliações dos Viajantes</h3>
        {totalReviews > 0 && (
          <div className="averageRating">
            <span className="ratingNumber">{averageRating.toFixed(1)}</span>
            <div className="stars">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="reviewCount">({totalReviews} avaliações)</span>
          </div>
        )}
      </div>

      {totalReviews === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>Ainda não há avaliações para este destino.</p>
        </div>
      ) : (
        <div className="reviewsList">
          {reviews.map((review) => (
            <div key={review.id} className="reviewItem">
              <div className="reviewHeader">
                <span className="userName">{review.userName}</span>
                <span className="reviewDate">{review.date}</span>
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