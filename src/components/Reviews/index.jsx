import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useReviews } from './hooks/useReviews';
import './ReviewModal.modal.css';

export function Reviews({ packageId }) {
  const { token } = useSelector((state) => state.auth);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newRating, setNewRating] = useState(10);
  const [newComment, setNewComment] = useState('');
  
  const {
    reviews,
    averageRating,
    isLoading,
    isSubmitting,
    addReview,
    totalReviews
  } = useReviews(packageId);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      alert('Por favor, escreva um comentário');
      return;
    }

    try {
      await addReview({
        rating: parseInt(newRating),
        comment: newComment.trim(),
        userName: 'Usuário Logado' // Aqui você pode pegar o nome do usuário do estado do Redux
      });
      
      setNewComment('');
      setNewRating(10);
      setShowAddReview(false);
      alert('Avaliação adicionada com sucesso!');
    } catch (error) {
      alert('Erro ao adicionar avaliação. Tente novamente.');
    }
  };

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

      {token && (
        <>
          {!showAddReview ? (
            <button 
              className="addReviewButton"
              onClick={() => setShowAddReview(true)}
            >
              Adicionar Avaliação
            </button>
          ) : (
            <form className="addReviewForm" onSubmit={handleSubmitReview}>
              <h4>Adicionar Nova Avaliação</h4>
              <p className="formDescription">
                Compartilhe sua experiência para ajudar outros viajantes!
              </p>
              
              <div className="ratingInput">
                <label htmlFor="rating">Nível de Satisfação (1-10):</label>
                <select 
                  id="rating"
                  value={newRating} 
                  onChange={(e) => setNewRating(e.target.value)}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} - {i + 1 <= 3 ? 'Ruim' : i + 1 <= 6 ? 'Regular' : i + 1 <= 8 ? 'Bom' : 'Excelente'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="commentInput">
                <label htmlFor="comment">Comentário (opcional):</label>
                <textarea
                  id="comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Conte sobre sua experiência neste destino..."
                  maxLength={500}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button 
                  type="submit" 
                  className="submitButton"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddReview(false);
                    setNewComment('');
                    setNewRating(10);
                  }}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '16px 32px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </>
      )}

      {totalReviews === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>Ainda não há avaliações para este destino.</p>
          {token ? (
            <p>Seja o primeiro a compartilhar sua experiência!</p>
          ) : (
            <p>Faça login para adicionar uma avaliação.</p>
          )}
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