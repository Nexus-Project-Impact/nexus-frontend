import React, { useState } from 'react';
import { ReviewForm } from './components/ReviewForm';

export default function AddReviewPage({ destination, dateRange, onSubmit, onClose }) {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (rating === null) {
      setError('Por favor, selecione uma nota.');
      return;
    }
    setIsLoading(true);
    try {
      await onSubmit({ rating, comment });
      setIsLoading(false);
      if (onClose) onClose();
    } catch (err) {
      setError('Erro ao enviar avaliação.');
      setIsLoading(false);
    }
  };

  return (
    <ReviewForm
      destination={destination}
      dateRange={dateRange}
      rating={rating}
      setRating={setRating}
      comment={comment}
      setComment={setComment}
      isLoading={isLoading}
      error={error}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
}
