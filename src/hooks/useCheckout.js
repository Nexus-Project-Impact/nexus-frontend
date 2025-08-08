import { useState, useMemo } from 'react';

export function useCheckout(packageData, travelers) {
  const [paymentMethod, setPaymentMethod] = useState('card'); // Cartão unificado como padrão

  const totalPrice = useMemo(() => {
    if (!packageData || !travelers || travelers.length === 0) {
      console.warn('useCheckout - Dados insuficientes:', { packageData: !!packageData, travelers: travelers?.length });
      return 0;
    }
    
    let priceValue = 0;
    
    // Tenta extrair o preço de diferentes estruturas possíveis
    if (packageData.price) {
      if (typeof packageData.price === 'number') {
        priceValue = packageData.price;
      } else if (packageData.price.current && typeof packageData.price.current === 'number') {
        priceValue = packageData.price.current;
      } else if (packageData.price.value && typeof packageData.price.value === 'number') {
        priceValue = packageData.price.value;
      } else if (typeof packageData.price === 'string') {
        priceValue = parseFloat(packageData.price);
      }
    } else if (packageData.value && typeof packageData.value === 'number') {
      // Este é o campo correto que vem da API!
      priceValue = packageData.value;
    } else if (packageData.valor && typeof packageData.valor === 'number') {
      priceValue = packageData.valor;
    } else if (packageData.preco && typeof packageData.preco === 'number') {
      priceValue = packageData.preco;
    }
    
    // Validação adicional
    if (isNaN(priceValue) || priceValue <= 0) {
      console.error('useCheckout - Preço inválido extraído:', { 
        originalPrice: packageData.price,
        originalValue: packageData.value,
        originalValor: packageData.valor,
        originalPreco: packageData.preco,
        extractedPrice: priceValue,
        packageData 
      });
      return 0;
    }
    
    const total = priceValue * travelers.length;
    console.log('useCheckout - Cálculo do total:', { priceValue, travelers: travelers.length, total });
    
    return total;
  }, [packageData, travelers]);

  return {
    totalPrice,
    paymentMethod,
    setPaymentMethod
  };
}