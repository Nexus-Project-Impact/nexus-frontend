import React, { useCallback, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';

// Lembre-se de colocar sua chave PUBLICÁVEL do Stripe aqui
const stripePromise = loadStripe('pk_test_51RqLiJFhACc0u91J9PBXQvVhzGPoFsTbUNCxogRhFokBt3qUDUUr6XfP6kXQ0xAU0BM7AIzDL1WhVkJZm6eLYzrU00FoiFPL3G');

export function StripeEmbeddedForm({ totalPrice }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Usando async/await para uma lógica mais clara
  const fetchClientSecret = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    if (!totalPrice || totalPrice <= 0) {
      const errorMsg = 'Valor total inválido para pagamento';
      setIsLoading(false);
      setError(errorMsg);
      throw new Error(errorMsg); // Throw instead of return null
    }
    
    try {
      
      // Primeiro, vamos tentar o endpoint de checkout session
      let response = await fetch("http://localhost:5235/api/payments/create-checkout-session", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice })
      });

      // Se o endpoint não existir (404), tentamos o endpoint antigo como fallback
      if (response.status === 404) {
        response = await fetch("http://localhost:5235/api/payments/create-payment-intent", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalPrice })
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('fetchClientSecret - Erro HTTP:', response.status, errorText);
        
        if (response.status === 404) {
          throw new Error('Endpoint de pagamento não encontrado. Verifique se o backend está configurado corretamente.');
        }
        
        throw new Error(`Erro na API: ${response.status} - ${errorText || 'Erro desconhecido'}`);
      }

      const data = await response.json();

      // Verifica se a propriedade existe (com 'c' minúsculo ou 'C' maiúsculo)
      const secret = data.clientSecret || data.ClientSecret;

      if (!secret) {
        throw new Error("A resposta do backend não continha o clientSecret.");
      }

      // Identifica o tipo de client secret
      if (secret.startsWith('pi_')) {
        throw new Error("⚠️ Backend configurado incorretamente!\n\nEmbedded Checkout requer Checkout Session (cs_), mas recebeu Payment Intent (pi_).\n\nSolução: Configure o backend para criar Checkout Sessions usando SessionService.Create() com UiMode = 'embedded'.");
      } else if (!secret.startsWith('cs_')) {
        throw new Error(`Formato de client secret inválido: ${secret.substring(0, 10)}...\nDeve começar com 'cs_' para Embedded Checkout.`);
      }

      setIsLoading(false);
      return secret;

    } catch (error) {
      console.error("fetchClientSecret - Falha crítica:", error);
      setIsLoading(false);
      setError(error.message || 'Erro desconhecido no pagamento');
      throw error; // Re-throw the error instead of returning null
    }
  }, [totalPrice]);

  const options = { fetchClientSecret };

  // Exibe erro se houver problema
  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        border: '1px solid #ff6b6b', 
        borderRadius: '8px', 
        backgroundColor: '#ffe0e0',
        color: '#d63447'
      }}>
        <h3>🚫 Erro no Pagamento</h3>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '12px', 
          borderRadius: '4px', 
          marginBottom: '15px',
          whiteSpace: 'pre-line',
          fontFamily: 'monospace',
          fontSize: '13px',
          border: '1px solid #ffcccb'
        }}>
          {error}
        </div>
        
        {error.includes('Backend configurado incorretamente') && (
          <div style={{ 
            backgroundColor: '#e8f5e8', 
            color: '#2d5a2d', 
            padding: '10px', 
            borderRadius: '4px',
            marginBottom: '15px',
            fontSize: '12px'
          }}>
            <strong>💡 Para desenvolvedores:</strong><br/>
            O backend precisa ser modificado para criar Checkout Sessions instead of Payment Intents.<br/>
            Consulte a documentação do Stripe para Embedded Checkout.
          </div>
        )}
        
        <button 
          onClick={() => setError(null)}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#d63447', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div id="checkout">
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Carregando formulário de pagamento...</p>
        </div>
      )}
      
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
        onError={(error) => {
          console.error('Erro do EmbeddedCheckoutProvider:', error);
          setError(`Erro no checkout: ${error.message}`);
        }}
      >
        <EmbeddedCheckout 
          onLoad={() => {
            setIsLoading(false);
          }}
          onError={(error) => {
            console.error('Erro do EmbeddedCheckout:', error);
            setError(`Erro no formulário: ${error.message}`);
            setIsLoading(false);
          }}
        />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
