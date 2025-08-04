import React from 'react';
import styles from './ErrorFallback.module.css';

export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <h2>Oops! Algo deu errado</h2>
        <p>Ocorreu um erro inesperado na aplicação.</p>
        <details className={styles.errorDetails}>
          <summary>Detalhes técnicos</summary>
          <pre>{error.message}</pre>
        </details>
        <div className={styles.actions}>
          <button onClick={resetErrorBoundary} className={styles.retryButton}>
            Tentar novamente
          </button>
          <button onClick={() => window.location.href = '/'} className={styles.homeButton}>
            Ir para página inicial
          </button>
        </div>
      </div>
    </div>
  );
}
