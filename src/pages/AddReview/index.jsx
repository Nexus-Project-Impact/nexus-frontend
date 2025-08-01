import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import packageService from '../../services/packageService';
import { ReviewForm } from './components/ReviewForm';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (rating === null) {
      setError('Por favor, selecione uma nota.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular envio da avaliação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aqui você faria a chamada real para a API
      console.log('Avaliação enviada:', {
        packageId,
        reservationId: reservationData?.reservationId,
        rating,
        comment,
        userName: 'Usuário Logado' // Aqui viria do Redux
      });

      alert('Avaliação enviada com sucesso!');
      
      // Voltar para as reservas ou pacotes
      if (reservationData?.fromReservations) {
        navigate('/reservas');
      } else {
        navigate(`/pacotes/${packageId}`);
      }
    } catch (err) {
      setError('Erro ao enviar avaliação. Tente novamente.');
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
