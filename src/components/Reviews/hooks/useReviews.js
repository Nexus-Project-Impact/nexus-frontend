import { useState, useEffect } from 'react';

// Mock data para reviews
const mockReviews = {
  1: [ // Fernando de Noronha
    {
      id: 1,
      userName: 'Maria Silva',
      rating: 9,
      comment: 'Viagem incrível! Fernando de Noronha é um paraíso. Recomendo muito!',
      date: '14/01/2025'
    },
    {
      id: 2,
      userName: 'João Santos',
      rating: 10,
      comment: 'Experiência única! Águas cristalinas e paisagens de tirar o fôlego.',
      date: '09/01/2025'
    },
    {
      id: 3,
      userName: 'Ana Costa',
      rating: 8,
      comment: 'Muito bom, mas poderia ter mais tempo livre para explorar.',
      date: '04/01/2025'
    }
  ],
  2: [ // Jericoacoara
    {
      id: 4,
      userName: 'Pedro Oliveira',
      rating: 9,
      comment: 'Jericoacoara superou todas as expectativas! As dunas e o pôr do sol são espetaculares.',
      date: '20/01/2025'
    },
    {
      id: 5,
      userName: 'Carla Mendes',
      rating: 8,
      comment: 'Lugar maravilhoso, mas a viagem até lá é um pouco cansativa.',
      date: '15/01/2025'
    }
  ],
  3: [ // Porto de Galinhas
    {
      id: 6,
      userName: 'Rafael Lima',
      rating: 10,
      comment: 'Porto de Galinhas é simplesmente perfeito! As piscinas naturais são incríveis.',
      date: '25/01/2025'
    }
  ]
};

export const useReviews = (packageId) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      // Simula uma chamada de API
      setTimeout(() => {
        const packageReviews = mockReviews[packageId] || [];
        setReviews(packageReviews);
        
        if (packageReviews.length > 0) {
          const avg = packageReviews.reduce((sum, review) => sum + review.rating, 0) / packageReviews.length;
          setAverageRating(avg);
        } else {
          setAverageRating(0);
        }
        
        setIsLoading(false);
      }, 500);
    };

    if (packageId) {
      loadReviews();
    }
  }, [packageId]);

  const addReview = async (newReview) => {
    setIsSubmitting(true);
    
    // Simula uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        const review = {
          id: Date.now(),
          userName: newReview.userName || 'Usuário Anônimo',
          rating: newReview.rating,
          comment: newReview.comment,
          date: new Date().toLocaleDateString('pt-BR')
        };

        const updatedReviews = [review, ...reviews];
        setReviews(updatedReviews);
        
        // Recalcula a média
        const avg = updatedReviews.reduce((sum, review) => sum + review.rating, 0) / updatedReviews.length;
        setAverageRating(avg);
        
        setIsSubmitting(false);
        resolve(review);
      }, 1000);
    });
  };

  return {
    reviews,
    averageRating,
    isLoading,
    isSubmitting,
    addReview,
    totalReviews: reviews.length
  };
};