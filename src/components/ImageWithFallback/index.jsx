import React, { useState } from 'react';

export function ImageWithFallback({ 
  src, 
  alt, 
  className, 
  fallbackSrc = '/src/assets/nexus-logo.png',
  ...props 
}) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imageSrc !== fallbackSrc) {
      setHasError(true);
      setImageSrc(fallbackSrc);
      console.warn(`Erro ao carregar imagem: ${src}, usando fallback: ${fallbackSrc}`);
    }
  };

  const handleLoad = () => {
    if (hasError) {
      setHasError(false);
    }
  };

  return (
    <img 
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
}
