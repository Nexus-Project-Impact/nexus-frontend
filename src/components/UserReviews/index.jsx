// Exemplo de como usar o hook useUserReviews na página de perfil

import React from 'react';
import { useSelector } from 'react-redux';
import { useUserReviews } from '../../hooks/useReview';

export function UserReviewsSection() {
  const { user } = useSelector((state) => state.auth);
  const { userReviews, isLoading, error } = useUserReviews(user?.id);

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
    return <div>Carregando suas avaliações...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div className="user-reviews-section">
      <h3>Minhas Avaliações ({userReviews.length})</h3>
      
      {userReviews.length === 0 ? (
        <p>Você ainda não fez nenhuma avaliação.</p>
      ) : (
        <div className="reviews-list">
          {userReviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <h4>{review.packageName || `Pacote ID: ${review.packageId}`}</h4>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              <div className="review-rating">
                <div className="stars">
                  {renderStars(parseInt(review.rating) || 0)}
                </div>
                <span>({review.rating}/10)</span>
              </div>
              
              {review.comment && review.comment.trim() !== '' && (
                <p className="review-comment">{review.comment}</p>
              )}
              
              {(!review.comment || review.comment.trim() === '') && (
                <p className="review-comment no-comment">
                  <em>Sem comentário adicional</em>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
