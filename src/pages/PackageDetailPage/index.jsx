import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackageById } from '../../services/packageService';
import styles from './PackageDetailPage.module.css';

export function PackageDetailPage() {
  const { packageId } = useParams(); // Pega o ID da URL
  const navigate = useNavigate(); // Hook para navegação

  const [pkg, setPkg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const loadPackageDetails = async () => {
      try {
        setIsLoading(true);
        const data = await getPackageById(packageId);
        setPkg(data);
        setMainImage(data.gallery[0]); // Define a primeira imagem como principal
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadPackageDetails();
  }, [packageId]); // Roda sempre que o ID na URL mudar

  if (isLoading) return <p>Carregando detalhes do pacote...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;
  if (!pkg) return <p>Pacote não encontrado.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.destinationTitle}>{pkg.name}</h2>
      <div className={styles.detailsGrid}>
        {/* Coluna da Esquerda */}
        <div className={styles.leftColumn}>
          <img src={mainImage} alt="Imagem principal do destino" className={styles.mainImage} />
          <div className={styles.thumbnailGallery}>
            {pkg.gallery.map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                alt={`Imagem ${index + 1} de ${pkg.name}`}
                className={mainImage === imgSrc ? styles.activeThumbnail : styles.thumbnail}
                onClick={() => setMainImage(imgSrc)}
              />
            ))}
          </div>
          <button onClick={() => navigate(-1)} className={styles.backButton}>Voltar</button>
        </div>

        {/* Coluna da Direita */}
        <div className={styles.rightColumn}>
          <h3 className={styles.tagline}>{pkg.title}</h3>
          <p className={styles.dates}>{`sáb. ${pkg.dates}`}</p>
          
          <div className={styles.descriptionBox}>
            <h4>DESCRIÇÃO</h4>
            <p><strong>Voo</strong></p>
            <p>Hora da Ida: {pkg.description.flight.departureTime} - {pkg.description.flight.from}</p>
            <p>Companhia Aérea: {pkg.description.flight.company}</p>
            <p>Hora da Volta: {pkg.description.flight.returnTime} - {pkg.description.flight.to}</p>
            <p>Companhia Aérea: {pkg.description.flight.company}</p>
            <br />
            <p><strong>Hotel</strong></p>
            <p>{pkg.description.hotel.name}</p>
            <p>Endereço: {pkg.description.hotel.address}</p>
          </div>

          <div className={styles.bookingBox}>
            <p>Voo + Hospedagem</p>
            <span className={styles.originalPrice}>de R$ {pkg.price.original.toLocaleString('pt-BR')}</span>
            <p>Preço por pessoa <span className={styles.currentPrice}>por R${pkg.price.current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
            <button className={styles.buyButton}>Compre Agora</button>
            <span className={styles.installments}>Em até {pkg.price.installments}x no cartão</span>
          </div>
        </div>
      </div>
    </div>
  );
}