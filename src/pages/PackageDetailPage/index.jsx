import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import packageService from '../../services/packageService';
import { ReservationModal } from '../../components/ReservationModal';
import { CheckoutModal } from '../../components/CheckoutModal';
import { Reviews } from '../../components/Reviews';
import styles from './PackageDetailPage.module.css';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

export function PackageDetailPage() {
  const { packageId } = useParams(); // Pega o ID da URL
  const navigate = useNavigate(); // Hook para navegação
  const { token } = useSelector((state) => state.auth); // 3. Pega o token do Redux

  const [pkg, setPkg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [reservationData, setReservationData] = useState(null);

   const handleProceedToCheckout = (travelers) => {
    setReservationData(travelers); // 3. Guarda os dados
    setIsReservationModalOpen(false); // Fecha o modal de reserva
    setIsCheckoutOpen(true); // Abre o modal de checkout
  };

  const formatarData = (data) => {
    return format(new Date(data), "EEE d MMM yyyy", { locale: ptBR });
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

  const handleBuyClick = () => {
    if (!token) {
      // Se não estiver logado, redireciona para o login
      navigate('/login');
    } else {
      // Se estiver logado, abre o modal
      setIsReservationModalOpen(true);
    }
  };

  if (isLoading) return <p>Carregando detalhes do pacote...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;
  if (!pkg) return <p>Pacote não encontrado.</p>;

  const {
  id,
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
          {/* <div className={styles.thumbnailGallery}>
            {pkg.gallery.map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                alt={`Imagem ${index + 1} de ${pkg.name}`}
                className={mainImage === imgSrc ? styles.activeThumbnail : styles.thumbnail}
                onClick={() => setMainImage(imgSrc)}
              />
            ))}
          </div> */}
          <button onClick={() => navigate(-1)} className={styles.backButton}>Voltar</button>
        </div>

        {/* Coluna da Direita */}
        <div className={styles.rightColumn}>
          <h3 className={styles.tagline}>{destination}</h3>

          {departureDate && returnDate && (
            <p className={styles.cardDates}>
              {new Date(departureDate).toLocaleDateString('pt-BR')} - {new Date(returnDate).toLocaleDateString('pt-BR')}
            </p>
          )}

           {/* <p className={styles.cardDates}>
          {`${formatarData(departureDate)} - ${formatarData(returnDate)}`}
        </p> */}
          
          <div className={styles.descriptionBox}>
            <h4>DESCRIÇÃO</h4>
            {/* Usando optional chaining (?.) para mais segurança */}
            {/* <p><strong>Voo</strong></p>
            <p>Hora da Ida: {pkg.description?.flight?.departureTime} - {pkg.description?.flight?.from}</p>
            <p>Companhia Aérea: {pkg.description?.flight?.company}</p>
            <p>Hora da Volta: {pkg.description?.flight?.returnTime} - {pkg.description?.flight?.to}</p>
            <p>Companhia Aérea: {pkg.description?.flight?.company}</p>
            <br />
            <p><strong>Hotel</strong></p>
            <p>{pkg.description?.hotel?.name}</p>
            <p>Endereço: {pkg.description?.hotel?.address}</p> */}
            <p>{description}</p>
          </div>

          <div className={styles.bookingBox}>
            <p>Voo + Hospedagem</p>
            {/* <span className={styles.originalPrice}>de R$ {pkg.price.original.toLocaleString('pt-BR')}</span> */}
            <div  className={styles.price}>

            <p>Preço por pessoa </p>
            <span className={styles.currentPrice}> R${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>

            </div>
            <button onClick={handleBuyClick} className={styles.buyButton}>Compre Agora</button>
            <span className={styles.installments}>Em até {price.installments || 12}x no cartão</span>
          </div>
        </div>
      </div>
      
      {/* Seção de Reviews - Logo após o grid principal */}
      <Reviews packageId={packageId} />
    </div>
    
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
  );
}