import { useState, useMemo } from 'react';
import { notificationService } from '../services/notificationService';

export function useCheckout(packageData, travelers) {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isLoading, setIsLoading] = useState(false);
  const [boletoData, setBoletoData] = useState(null);

  const totalPrice = useMemo(() => {
    if (!packageData || !travelers || !packageData.price) return 0;
    
    // Verifica se price.current existe, senão usa price diretamente
    const priceValue = packageData.price.current || packageData.price;
    
    return priceValue * travelers.length;
  }, [packageData, travelers]);
  
  // A função agora é apenas para os métodos que NÃO são Stripe
  const handleFinalizePurchase = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (paymentMethod === 'debit') {
      console.log('Simulando compra com cartão de débito...');
      setTimeout(() => {
        notificationService.booking.purchaseSuccess();
        setIsLoading(false);
        window.location.href = '/';
      }, 1500);
    }

    if (paymentMethod === 'boleto') {
      console.log('Gerando boleto...');
      setTimeout(() => {
        const fakeBarcode = '12345 67890 12345 67890 12345 67890 1 12345678901234';
        setBoletoData({ barcode: fakeBarcode, dueDate: 'Vencimento em 3 dias úteis' });
        setIsLoading(false);
      }, 1500);
    }
  };

  return {
    totalPrice,
    paymentMethod,
    setPaymentMethod,
    isLoading,
    handleFinalizePurchase,
    boletoData
  };
}