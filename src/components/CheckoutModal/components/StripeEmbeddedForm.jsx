// DENTRO DE: src/components/CheckoutModal/StripeEmbeddedForm.jsx

import React, { useCallback, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';

// Coloque sua chave publicável do Stripe aqui (começa com pk_test_...)
const stripePromise = loadStripe('sk_test_51RopuqEA6mLoMq50zWUzXMeEspWEKtb1F3cdvWPDBzNvCUs4RCVApx5j61kyJcHLiXDEyWagmrjTwhaE9KLMxb5o00dFTySE4R');

export function StripeEmbeddedForm({ totalPrice }) {
  const [clientSecret, setClientSecret] = useState('');

  // Esta função busca o clientSecret do seu backend
  const fetchClientSecret = useCallback(() => {
    // A URL deve apontar para o seu backend que está rodando
    return fetch("http://localhost:4242/create-payment-intent", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      // Envia o valor total para o backend
      body: JSON.stringify({ amount: totalPrice }) 
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        return data.clientSecret; // Retorna o clientSecret para o Stripe
      })
      .catch(err => console.error("Erro ao buscar client secret:", err));
  }, [totalPrice]);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      {/* O Provider do Stripe precisa do clientSecret para funcionar */}
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        {/* Este componente renderiza o formulário completo do Stripe */}
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}