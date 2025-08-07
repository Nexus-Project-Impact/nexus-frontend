import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import packageService from '../../services/packageService';
import { ReservationModal } from '../../components/ReservationModal';
import { CheckoutModal } from '../../components/CheckoutModal';
import { Reviews } from '../../components/Reviews';
import { LocationMap } from '../../components/LocationMap';
import { notificationService } from '../../services/notificationService';
import { useReview } from '../../hooks/useReview';
import styles from './PackageDetailPage.module.css';
import { style } from 'framer-motion/client';

export function PackageDetailPage() {
  const { packageId } = useParams(); // Pega o ID da URL
  const navigate = useNavigate(); // Hook para navegação
  const location = useLocation(); // Hook para acessar location.state
  const { token, user } = useSelector((state) => state.auth); // 3. Pega o token do Redux

  // Verificar se veio das reservas
  const isFromReservations = location.state?.fromReservations || false;
  const shouldHideCheckout = location.state?.hideCheckout || false;

  const [pkg, setPkg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [reservationData, setReservationData] = useState(null);

  // Hook para verificar se usuário pode avaliar
  const { canReview, checkCanReview } = useReview(packageId);

   const handleProceedToCheckout = (travelers) => {
    setReservationData(travelers); // 3. Guarda os dados
    setIsReservationModalOpen(false); // Fecha o modal de reserva
    setIsCheckoutOpen(true); // Abre o modal de checkout
  };

  const handleReviewClick = () => {
    if (!token) {
      notificationService.review.createError('Você precisa estar logado para avaliar um pacote.');
      navigate('/login');
      return;
    }
    
    if (!pkg) {
      notificationService.review.createError('Dados do pacote não carregados.');
      return;
    }
    
    // Passar dados do pacote para a página de avaliação
    navigate(`/avaliar/${packageId}`, {
      state: {
        packageId,
        packageName: pkg.name || pkg.title || 'Pacote',
        destination: pkg.destination || pkg.name || 'Destino',
        departureDate: pkg.departureDate,
        returnDate: pkg.returnDate,
        packageImage: pkg.imageUrl || pkg.image || pkg.imagePackage,
        fromReservations: false
      }
    });
  };

  useEffect(() => {
    const loadPackageDetails = async () => {
      try {
        setIsLoading(true);
        const data = await packageService.getPackageById(packageId);
        setPkg(data);
        if (data.imageUrl || data.image) {
        setMainImage(data.imageUrl || data.image);
      }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadPackageDetails();
  }, [packageId]); // Roda sempre que o ID na URL mudar

  // Verificar se usuário pode avaliar quando estiver logado e dados carregados
  useEffect(() => {
    const checkReviewPermission = async () => {
      if (token && user && packageId && pkg && !isLoading) {
        try {
          await checkCanReview();
        } catch (error) {
          console.error('Erro ao verificar permissão de avaliação:', error);
        }
      }
    };
    
    checkReviewPermission();
  }, [token, user, packageId, pkg, isLoading, checkCanReview]); // Dependências completas

  const handleBuyClick = () => {
    // Se veio das reservas, não permite nova compra
    if (shouldHideCheckout) {
      notificationService.booking.createError('Você já possui uma reserva para este pacote.');
      return;
    }

    if (!token) {
      // Mostra notificação antes de redirecionar para o login
      notificationService.booking.purchaseLoginRequired();
      // Aguarda um pouco para a notificação aparecer antes do redirecionamento
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } else {
      // Se estiver logado, abre o modal
      setIsReservationModalOpen(true);
    }
  };

  if (isLoading) return <p>Carregando detalhes do pacote...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;
  if (!pkg) return <p>Pacote não encontrado.</p>;

  const {
  title = pkg.name || 'Título não disponível',
  imageUrl = pkg.image || mainImage || 'https://via.placeholder.com/400x300',
  destination = pkg.destination || 'Destino não disponível',
  departureDate,
  returnDate,
  description = pkg.details || 'Descrição não disponível',
  price = pkg.pricePackage || pkg.price || pkg.value || 0,
 
} = pkg;

  return (
    <>
    <div className={styles.container}>
      <h2 className={styles.destinationTitle}>{title}</h2>
      <div className={styles.detailsGrid}>
        {/* Coluna da Esquerda */}
        <div className={styles.leftColumn}>
          <img src={imageUrl} alt="Imagem principal do destino" className={styles.mainImage} />
          
          {/* Mapa da Localização */}
          <div className={styles.containerLocationMap}>
            <LocationMap destination={destination} className={styles.locationMap} />
          </div>  
            <div className={styles.containerBackButton}>
              <button onClick={() => navigate(-1)} className={styles.backButton}>Voltar</button>
            </div>
        </div>

        {/* Coluna da Direita */}
        <div className={styles.rightColumn}>
          <h3 className={styles.tagline}>{destination}</h3>

          {departureDate && returnDate && (
            <div className={styles.cardDates}>
              <strong>Data da Viagem:</strong>{' '}
              {new Date(departureDate).toLocaleDateString('pt-BR')} - {new Date(returnDate).toLocaleDateString('pt-BR')}
            </div>
          )}
          
          <div className={styles.descriptionBox}>
            <h4>DESCRIÇÃO</h4>
            <p>{description}</p>
          </div>

          {/* Só mostra o bookingBox se não veio das reservas */}
          {!shouldHideCheckout && (
            <div className={styles.bookingBox}>
              <p>Voo + Hospedagem</p>
              <div  className={styles.price}>

              <p>Preço por pessoa </p>
              <span className={styles.currentPrice}> R${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>

              </div>
              
              <button onClick={handleBuyClick} className={styles.buyButton}>Compre Agora</button>
              
              <span className={styles.installments}>Em até {price.installments || 12}x no cartão</span>
            </div>
          )}
          
          {/* Mostra mensagem informativa se veio das reservas */}
          {isFromReservations && (
            <div className={styles.reservationNotice}>
              <p>📋 Você está visualizando um pacote das suas reservas</p>
            </div>
          )}
          
          {/* Botão para avaliar pacote - só aparece se usuário puder avaliar */}
          {token && canReview && (
            <button 
              onClick={handleReviewClick} 
              className={styles.reviewButton}
            >
              ⭐ Avaliar Pacote
            </button>
          )}
          
          {/* Seção de Reviews - No desktop fica aqui, no mobile será reposicionada via CSS */}
          <div className={styles.reviewsSection}>
            <Reviews packageId={packageId} />
          </div>
          
          {/* Botão Voltar - visível apenas em mobile */}
          <button onClick={() => navigate(-1)} className={`${styles.backButton} ${styles.backButtonMobile}`}>Voltar</button>
        </div>
      </div>
    </div>
    
   {/* Só renderiza os modais se não veio das reservas */}
   {!shouldHideCheckout && (
     <>
       <ReservationModal
         isOpen={isReservationModalOpen}
         onClose={() => setIsReservationModalOpen(false)}
         onSaveAndProceed={handleProceedToCheckout} // 4. Passe a nova função
       />

       <CheckoutModal
         isOpen={isCheckoutOpen}
         onClose={() => setIsCheckoutOpen(false)}
         packageData={pkg} // 5. Passe os dados necessários
         travelers={reservationData}
       />
     </>
   )}
    </>
  );
}