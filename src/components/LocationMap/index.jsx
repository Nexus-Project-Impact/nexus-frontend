import React, { useState, useEffect } from 'react';
import styles from './LocationMap.module.css';

export function LocationMap({ destination, className = '' }) {
  const [iframeError, setIframeError] = useState(false);
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    if (!destination) {
      setIframeError(true);
      return;
    }

    // Encode o nome da cidade para uso na URL
    const encodedDestination = encodeURIComponent(destination);
    
    // Para esta implementação, vamos usar uma versão simplificada do Google Maps
    const simpleGoogleEmbed = `https://maps.google.com/maps?width=100%25&height=400&hl=pt&q=${encodedDestination}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
    
    setMapUrl(simpleGoogleEmbed);
  }, [destination]);

  const handleIframeError = () => {
    setIframeError(true);
  };

  if (!destination) {
    return (
      <div className={`${styles.mapContainer} ${className}`}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>🗺️</div>
          <p>Localização não disponível</p>
        </div>
      </div>
    );
  }

  if (iframeError) {
    return (
      <div className={`${styles.mapContainer} ${className}`}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>📍</div>
          <h4>{destination}</h4>
          <p>Mapa não disponível no momento</p>
          <a 
            href={`https://www.google.com/maps/search/${encodeURIComponent(destination)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.externalLink}
          >
            Ver no Google Maps
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.mapContainer} ${className}`}>
      <div className={styles.mapWrapper}>
        <iframe
          src={mapUrl}
          className={styles.mapIframe}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Mapa de ${destination}`}
          onError={handleIframeError}
        />
      </div>
      <div className={styles.mapFooter}>
        <a 
          href={`https://www.google.com/maps/search/${encodeURIComponent(destination)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.externalLink}
        >
          Ver no Google Maps →
        </a>
      </div>
    </div>
  );
}
