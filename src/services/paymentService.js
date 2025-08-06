import api from './api';

const paymentService = {

  // Pagamento com cartão (usando endpoint pay-card que retorna secret para Stripe)
  createCardPayment: async (paymentData) => {
    try {
      console.log('PaymentService - Criando pagamento cartão:', paymentData);
      
      const requestPayment = {
        UserId: paymentData.userId,
        AmountPaid: paymentData.amountPaid,
        Receipt: paymentData.receipt || `Pagamento cartão - ${new Date().toISOString()}`,
        TravelPackageId: paymentData.travelPackageId,
        Traveler: paymentData.travelers.map(traveler => ({
          Name: traveler.name || traveler.Name || '',
          Rg: (traveler.rg || traveler.Rg || '').replace(/\D/g, '') // Remove máscara, envia apenas números
        }))
      };

      console.log('🔵 Request completo para cartão:', requestPayment);
      
      const response = await api.post('/Payment/pay-card', requestPayment);
      return response.data; // Deve retornar o secret ID para o Stripe
    } catch (error) {
      console.error('PaymentService - Erro no Cartão:', error);
      throw error;
    }
  },

  // Pagamento com PIX
  createPixPayment: async (paymentData) => {
    try {
      console.log('PaymentService - Criando pagamento PIX:', paymentData);
      
      const requestPayment = {
        UserId: paymentData.userId,
        AmountPaid: paymentData.amountPaid,
        Receipt: paymentData.receipt || `Pagamento PIX - ${new Date().toISOString()}`,
        TravelPackageId: paymentData.travelPackageId,
        Traveler: paymentData.travelers.map(traveler => ({
          Name: traveler.name || traveler.Name || '',
          Rg: (traveler.rg || traveler.Rg || '').replace(/\D/g, '') // Remove máscara, envia apenas números
        }))
      };

      console.log('🟡 Request completo para PIX:', requestPayment);

      const response = await api.post('/Payment/pay-pix', requestPayment);
      return response.data;
    } catch (error) {
      console.error('PaymentService - Erro no PIX:', error);
      throw error;
    }
  },

  // Pagamento com Boleto
  createBoletoPayment: async (paymentData) => {
    try {
      console.log('PaymentService - Criando boleto:', paymentData);
      
      const requestPayment = {
        UserId: paymentData.userId,
        AmountPaid: paymentData.amountPaid,
        Receipt: paymentData.receipt || `Pagamento Boleto - ${new Date().toISOString()}`,
        TravelPackageId: paymentData.travelPackageId,
        Traveler: paymentData.travelers.map(traveler => ({
          Name: traveler.name || traveler.Name || '',
          Rg: (traveler.rg || traveler.Rg || '').replace(/\D/g, '') // Remove máscara, envia apenas números
        }))
      };

      console.log('🟠 Request completo para Boleto:', requestPayment);

      const response = await api.post('/Payment/pay-boleto', requestPayment);
      return response.data;
    } catch (error) {
      console.error('PaymentService - Erro no Boleto:', error);
      throw error;
    }
  }
};

export default paymentService;
