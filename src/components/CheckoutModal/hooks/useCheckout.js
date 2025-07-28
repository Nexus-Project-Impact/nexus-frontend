import { useState, useMemo } from 'react';

// O hook recebe os dados como argumentos
export function useCheckout(packageData, travelers) {
  const [paymentMethod, setPaymentMethod] = useState('credit'); // 'credit', 'debit', 'boleto'
  const [cardDetails, setCardDetails] = useState({ number: '', validity: '', name: '', cpf: '', cvv: '' });
  const [installments, setInstallments] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // useMemo otimiza os cálculos, evitando que sejam refeitos a cada renderização
  const totalPrice = useMemo(() => {
    if (!packageData || !travelers) return 0;
    return packageData.price.current * travelers.length;
  }, [packageData, travelers]);

  const installmentOptions = useMemo(() => {
    if (totalPrice === 0) return [];
    const options = [];
    for (let i = 1; i <= 12; i++) {
      options.push({
        times: i,
        value: (totalPrice / i).toFixed(2),
      });
    }
    return options;
  }, [totalPrice]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleFinalizePurchase = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Finalizando compra com os seguintes dados:', {
      packageId: packageData.id,
      travelers,
      payment: {
        method: paymentMethod,
        details: cardDetails,
        installments,
        total: totalPrice,
      }
    });
    // Simula chamada de API de pagamento
    setTimeout(() => {
      alert('Compra finalizada com sucesso! (Simulação)');
      setIsLoading(false);
      window.location.href = '/'; // Redireciona para a home após sucesso
    }, 1500);
  };

  return {
    totalPrice,
    installmentOptions,
    paymentMethod,
    setPaymentMethod,
    cardDetails,
    handleInputChange,
    installments,
    setInstallments,
    isLoading,
    handleFinalizePurchase,
  };
}