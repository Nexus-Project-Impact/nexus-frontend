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

  // Debug: verificar os dados recebidos
  console.log('Reviews Component - packageId:', packageId);
  console.log('Reviews Component - reviews:', reviews);
  console.log('Reviews Component - stats:', stats);
  console.log('Reviews Component - isLoading:', isLoading);
  console.log('Reviews Component - error:', error);

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

      {(stats.totalReviews === 0 || !reviews || reviews.length === 0) ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>Ainda não há avaliações para este destino.</p>
          <p><small>Debug: stats.totalReviews={stats.totalReviews}, reviews.length={reviews?.length}</small></p>
        </div>
      ) : (
        <div className="reviewsList">
          {reviews.map((review, index) => {
            // Tentar obter o nome do usuário de diferentes campos
            const userName = review.userName || 
                           review.clientName || 
                           review.user?.name || 
                           review.user?.nome || 
                           review.client?.name || 
                           review.client?.nome ||
                           `Usuário #${review.userId || review.clientId || 'Anônimo'}`;
            
            return (
              <div key={review.id || index} className="reviewItem">
                <div className="reviewHeader">
                  <span className="userName">{userName}</span>
                  <span className="reviewDate">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString('pt-BR') : 
                     review.date ? new Date(review.date).toLocaleDateString('pt-BR') : 
                     'Data não disponível'}
                  </span>
                </div>
                
                <div className="reviewRating">
                  <div className="stars">
                    {renderStars(parseInt(review.rating) || 0)}
                  </div>
                  <span className="ratingText">({review.rating || 0}/10)</span>
                </div>
                
                <p className="reviewComment">{review.comment || 'Sem comentário'}</p>
                
                {/* Debug info - remover em produção */}
                <small style={{ color: '#999', fontSize: '0.8rem' }}>
                  Debug: ID={review.id}, UserID={review.userId || review.clientId}, 
                  UserName="{review.userName || review.clientName || 'N/A'}", 
                  Rating={review.rating}, Comment="{review.comment}"
                </small>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}