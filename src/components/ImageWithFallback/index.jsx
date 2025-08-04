import React, { useState } from 'react';

export function ImageWithFallback({ 
  src, 
  fallbackSrc = 'https://via.placeholder.com/400x300?text=Imagem+Indisponivel', 
  alt = '', 
  className = '',
  ...props 
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    console.log('Erro ao carregar imagem:', src);
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    console.log('Imagem carregada com sucesso:', imgSrc);
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
}
