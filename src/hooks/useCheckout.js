import { useState, useMemo } from 'react';

// O hook recebe os dados como argumentos
export function useCheckout(packageData, travelers) {
  const [paymentMethod, setPaymentMethod] = useState('credit'); // 'credit', 'debit', 'boleto', 'pix'
  const [cardDetails, setCardDetails] = useState({ number: '', validity: '', name: '', cpf: '', cvv: '' });
  const [installments, setInstallments] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [boletoData, setBoletoData] = useState(null); 
  const [pixData, setPixData] = useState(null); 

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
  setCardDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
};

  
  const handleFinalizePurchase = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Lógica para Cartão de Crédito e Débito (simulação simples)
    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      console.log('Finalizando compra com cartão...');
      setTimeout(() => {
        alert('Compra finalizada com sucesso! (Simulação)');
        setIsLoading(false);
        window.location.href = '/';
      }, 1500);
    }

    // Lógica para Boleto
    if (paymentMethod === 'boleto') {
      console.log('Gerando boleto...');
      setTimeout(() => {
        // Gera um código de barras falso
        const fakeBarcode = '12345 67890 12345 67890 12345 67890 1 12345678901234';
        setBoletoData({ barcode: fakeBarcode, dueDate: 'Vencimento em 3 dias úteis' });
        setIsLoading(false);
      }, 1500);
    }

    // Lógica para PIX
    if (paymentMethod === 'pix') {
      console.log('Gerando PIX...');
      setTimeout(() => {
        // Gera um código PIX falso
        const fakePixCode = '00020126580014BR.GOV.BCB.PIX136366f39c-4518-4d79-a7c7-7e7d4c5e8f920219Pagamento Nexus5204000053039865802BR5925NEXUS VIAGENS E TURISMO6009SAO PAULO61080540900062070503***6304A1B2';
        setPixData({ 
          qrCode: fakePixCode, 
          dueDate: 'PIX válido por 30 minutos',
          expiryTime: new Date(Date.now() + 30 * 60 * 1000).toLocaleTimeString()
        });
        setIsLoading(false);
      }, 1500);
    }
  };

  return {
    totalPrice, installmentOptions, paymentMethod, setPaymentMethod,
    cardDetails, handleInputChange, installments, setInstallments,
    isLoading, handleFinalizePurchase, boletoData, pixData
  };
}