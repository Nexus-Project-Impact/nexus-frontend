import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import packageService from '../../services/packageService';
import { useReview } from '../../hooks/useReview';
import { notificationService } from '../../services/notificationService';
import { ReviewForm } from './components';
import { useErrorHandler } from '../../hooks/useErrorHandler';

export function AddReviewPage() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { token } = useSelector((state) => state.auth);
  const { handleAsync, error: hookError } = useErrorHandler();
  
  const [packageData, setPackageData] = useState(null);
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPackage, setIsLoadingPackage] = useState(true);
  const [error, setError] = useState('');

  // Hook para gerenciar reviews
  const { addReview, canReview } = useReview(packageId);

  // Dados vindos da página de reservas
  const reservationData = location.state;

  useEffect(() => {
    // Verificar se está logado
    if (!token) {
      navigate('/login');
      return;
    }

    // Carregar dados do pacote
    const loadPackageData = async () => {
      try {
        setIsLoadingPackage(true);
        const data = await handleAsync(() => packageService.getPackageById(packageId));
        setPackageData(data);
      } catch (err) {
        setError(hookError || 'Erro ao carregar dados do pacote');
      } finally {
        setIsLoadingPackage(false);
      }
    };

    loadPackageData();
  }, [packageId, token, navigate]);

  // Verificar se usuário pode avaliar (pode adicionar uma verificação adicional)
  useEffect(() => {
    if (!canReview && packageData && !isLoadingPackage) {
      // Opcional: mostrar aviso se usuário não pode avaliar
      console.log('Usuário já avaliou este pacote ou não tem permissão');
    }
  }, [canReview, packageData, isLoadingPackage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (rating === null) {
      setError('Por favor, selecione uma nota.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Usar o hook para adicionar a review
      const result = await addReview({
        rating: rating,
        comment: comment,
        reservationId: reservationData?.reservationId // Se vier de uma reserva
      });

      if (result.success) {
        // Notificar sucesso
        notificationService.review.createSuccess();
        
        // Se veio de reservas, atualizar o estado da reserva
        if (reservationData?.fromReservations && reservationData?.reservationId) {
          // Aqui poderia chamar uma função para atualizar o estado da reserva
          // markAsReviewed(reservationData.reservationId);
        }
        
        // Voltar para as reservas ou pacotes
        if (reservationData?.fromReservations) {
          navigate('/reservas');
        } else {
          navigate(`/pacotes/${packageId}`);
        }
      } else {
        setError(result.error || 'Erro ao enviar avaliação. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao enviar avaliação. Tente novamente.');
      console.error('Erro ao enviar review:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (reservationData?.fromReservations) {
      navigate('/reservas');
    } else {
      navigate(`/pacotes/${packageId}`);
    }
  };

  if (isLoadingPackage) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Carregando dados do pacote...
      </div>
    );
  }

  if (!packageData) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        color: '#666'
      }}>
        <h2>Pacote não encontrado</h2>
        <button 
          onClick={() => navigate('/pacotes')}
          style={{
            padding: '12px 24px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Voltar aos Pacotes
        </button>
      </div>
    );
  }

  return (
    <ReviewForm
      destination={packageData.name}
      dateRange={packageData.dates}
      packageImage={packageData.image}
      rating={rating}
      setRating={setRating}
      comment={comment}
      setComment={setComment}
      isLoading={isLoading}
      error={error}
      onSubmit={handleSubmit}
      onClose={handleClose}
      isFromReservation={reservationData?.fromReservations}
    />
  );
}

export default AddReviewPage;
