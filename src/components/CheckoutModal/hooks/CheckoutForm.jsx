import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      // Stripe.js ainda não carregou.
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // URL para onde o cliente será redirecionado após o pagamento
        return_url: `${window.location.origin}/pagamento-sucesso`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={isLoading || !stripe || !elements} style={{ marginTop: '20px' }}>
        {isLoading ? "Processando..." : "Pagar Agora"}
      </button>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
    </form>
  );
}