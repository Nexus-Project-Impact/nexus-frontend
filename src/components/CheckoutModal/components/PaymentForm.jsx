import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import paymentService from '../../../services/paymentService';
import { notificationService } from '../../../services/notificationService';
import styles from '../CheckoutModal.module.css';

const stripePromise = loadStripe('pk_test_51RopuqEA6mLoMq50lExGsbT3SZ3ap1vMNE3CGt75XLf0viaKmdXdLAGwGeHzbqoul5x7bVFgwVFxwmTv7UMvP4lX00EhfPpQhq');

// Componente interno para formulário de cartão com Stripe Elements
function CardPaymentForm({ totalPrice, paymentData, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [cardError, setCardError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);

  const handleCardChange = (event) => {
    setCardError(event.error ? event.error.message : null);
    setCardComplete(event.complete);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      // 1. Obter clientSecret do backend
      const backendResult = await paymentService.createCardPayment(paymentData);
      console.log('🔵 ClientSecret recebido:', backendResult);

      if (!backendResult.clientSecret) {
        throw new Error('ClientSecret não foi retornado pelo servidor');
      }

      // 2. Confirmar pagamento com Stripe Elements
      const cardElement = elements.getElement(CardElement);
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(backendResult.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName,
          }
        }
      });

      if (error) {
        console.error('❌ Erro do Stripe:', error);
        throw new Error(error.message || 'Erro ao processar pagamento com Stripe');
      }

      if (paymentIntent.status === 'succeeded') {
        console.log('✅ Pagamento confirmado pelo Stripe:', paymentIntent);
        const result = { ...backendResult, stripePayment: paymentIntent };
        onSuccess(result);
        notificationService.booking.purchaseSuccess();
      } else {
        throw new Error(`Status do pagamento: ${paymentIntent.status}`);
      }

    } catch (error) {
      console.error('Erro no pagamento:', error);
      onError(error.message || 'Erro ao processar pagamento');
      notificationService.booking.purchaseError();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.paymentForm}>
      <div className={styles.cardForm}>
        <h4>Dados do Cartão</h4>
        
        <div className={styles.inputGroup}>
          <label>Nome do Titular *</label>
          <input
            type="text"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            placeholder="João Silva"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Dados do Cartão *</label>
          <div className={`${styles.cardElement} ${cardComplete ? styles.cardComplete : ''} ${cardError ? styles.cardError : ''}`}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#495057',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    '::placeholder': {
                      color: '#6c757d',
                    },
                    iconColor: '#007bff',
                  },
                  invalid: {
                    color: '#dc3545',
                    iconColor: '#dc3545',
                  },
                  complete: {
                    color: '#28a745',
                    iconColor: '#28a745',
                  },
                },
                hidePostalCode: true,
                disableLink: true,
              }}
              onChange={handleCardChange}
            />
          </div>
          {cardError && (
            <div className={styles.cardErrorMessage}>
              ⚠️ {cardError}
            </div>
          )}
          {cardComplete && (
            <div className={styles.cardSuccessMessage}>
              ✅ Dados do cartão válidos
            </div>
          )}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={!stripe || isLoading}
        className={styles.submitButton}
      >
        {isLoading ? (
          <>⏳ Processando...</>
        ) : (
          <>💳 Pagar R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</>
        )}
      </button>
    </form>
  );
}

export function PaymentForm({ paymentMethod, totalPrice, packageData, travelers, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Obter userId do localStorage ou Redux (dependendo da implementação)
  const getUserId = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.nameid || payload.sub || payload.userId || payload.id;
      } catch (error) {
        console.error('Erro ao extrair userId do token:', error);
        return null;
      }
    }
    return null;
  };

  const paymentData = {
    userId: getUserId(),
    amountPaid: totalPrice,
    receipt: `Pagamento ${paymentMethod} - ${packageData.title || packageData.name} - ${new Date().toISOString()}`,
    travelPackageId: packageData.id || packageData.packageId || 1,
    travelers: travelers || []
  };

  const handlePaymentSuccess = (result) => {
    setPaymentResult(result);
    setError(null);
  };

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
    setPaymentResult(null);
  };

  const handleNonCardPayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('💳 Dados do pagamento enviando:', paymentData);
      
      let result;
      if (paymentMethod === 'pix') {
        result = await paymentService.createPixPayment(paymentData);
        notificationService.booking.pixCreated();
      } else if (paymentMethod === 'boleto') {
        result = await paymentService.createBoletoPayment(paymentData);
        notificationService.booking.boletoCreated();
      }

      setPaymentResult(result);
    } catch (error) {
      console.error('Erro no pagamento:', error);
      setError(error.message || 'Erro ao processar pagamento');
      notificationService.booking.purchaseError();
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    notificationService.booking.copied();
  };

  // Se já temos resultado do pagamento, mostrar os dados
  if (paymentResult) {
    return (
      <div className={styles.paymentResult}>
        {paymentMethod === 'card' && (
          <div className={styles.cardResult}>
            <div className={styles.successHeader}>
              <div className={styles.successIcon}>✅</div>
              <h3>Pagamento Processado com Sucesso!</h3>
              <p>Seu pagamento com cartão foi confirmado pelo Stripe</p>
            </div>
            
            <div className={styles.paymentSummary}>
              <div className={styles.summaryItem}>
                <strong>Valor:</strong> 
                <span className={styles.amount}>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className={styles.summaryItem}>
                <strong>Método:</strong> 
                <span>Cartão de Crédito</span>
              </div>
              <div className={styles.summaryItem}>
                <strong>Status:</strong> 
                <span className={styles.statusConfirmed}>Pagamento confirmado</span>
              </div>
              {paymentResult.stripePayment && (
                <div className={styles.summaryItem}>
                  <strong>ID da transação:</strong> 
                  <span>{paymentResult.stripePayment.id}</span>
                </div>
              )}
            </div>

            <div className={styles.successActions}>
              <button 
                onClick={onClose}
                className={styles.primaryButton}
              >
                <span className={styles.buttonIcon}>🎉</span>
                Reserva Confirmada - Fechar
              </button>
              <p className={styles.successMessage}>
                Sua reserva foi confirmada com sucesso!
              </p>
            </div>
          </div>
        )}

        {paymentMethod === 'pix' && (
          <div className={styles.pixResult}>
            <div className={styles.successHeader}>
              <div className={styles.successIcon}>✅</div>
              <h3>PIX Gerado com Sucesso!</h3>
              <p>Escaneie o QR Code ou copie o código PIX para pagar</p>
            </div>

            <div className={styles.paymentSummary}>
              <div className={styles.summaryItem}>
                <strong>Valor:</strong> 
                <span className={styles.amount}>R$ {(paymentResult.amount || totalPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className={styles.summaryItem}>
                <strong>Status:</strong> 
                <span className={styles.statusPending}>Aguardando pagamento</span>
              </div>
              {paymentResult.payerName && (
                <div className={styles.summaryItem}>
                  <strong>Pagador:</strong> 
                  <span>{paymentResult.payerName}</span>
                </div>
              )}
              {paymentResult.transactionId && (
                <div className={styles.summaryItem}>
                  <strong>ID da transação:</strong> 
                  <span>{paymentResult.transactionId}</span>
                </div>
              )}
            </div>

            {paymentResult.qrCodeImageUrl && (
              <div className={styles.qrCodeSection}>
                <div className={styles.qrCodeContainer}>
                  <img 
                    src={paymentResult.qrCodeImageUrl} 
                    alt="QR Code PIX"
                    className={styles.qrCode}
                  />
                </div>
              </div>
            )}

            {paymentResult.qrCode && (
              <div className={styles.pixCodeSection}>
                <div className={styles.pixCodeContainer}>
                  <label className={styles.pixCodeLabel}>Código PIX (Copia e Cola):</label>
                  <div className={styles.codeWrapper}>
                    <input 
                      type="text" 
                      readOnly 
                      value={paymentResult.qrCode}
                      className={styles.pixCodeInput}
                    />
                    <button 
                      type="button" 
                      onClick={() => copyToClipboard(paymentResult.qrCode)}
                      className={styles.copyButton}
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.instructionsCard}>
              <div className={styles.instructionsHeader}>
                <span className={styles.instructionsIcon}>💡</span>
                <h4>Como pagar com PIX</h4>
              </div>
              <div className={styles.instructionsList}>
                <div className={styles.instructionStep}>
                  <span className={styles.stepNumber}>1</span>
                  <span>Abra o app do seu banco ou carteira digital</span>
                </div>
                <div className={styles.instructionStep}>
                  <span className={styles.stepNumber}>2</span>
                  <span>Escaneie o QR Code ou copie e cole o código PIX</span>
                </div>
                <div className={styles.instructionStep}>
                  <span className={styles.stepNumber}>3</span>
                  <span>Confirme os dados e finalize o pagamento</span>
                </div>
                <div className={styles.instructionStep}>
                  <span className={styles.stepNumber}>4</span>
                  <span>O pagamento é processado instantaneamente</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'boleto' && (
          <div className={styles.boletoResult}>
            <div className={styles.successHeader}>
              <div className={styles.successIcon}>✅</div>
              <h3>Boleto Gerado com Sucesso!</h3>
              <p>Seu boleto foi criado e está pronto para pagamento</p>
            </div>
            
            <div className={styles.paymentSummary}>
              <div className={styles.summaryItem}>
                <strong>Valor:</strong> 
                <span className={styles.amount}>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className={styles.summaryItem}>
                <strong>Status:</strong> 
                <span className={styles.statusPending}>Aguardando pagamento</span>
              </div>
              <div className={styles.summaryItem}>
                <strong>Vencimento:</strong> 
                <span>3 dias úteis</span>
              </div>
            </div>

            <div className={styles.boletoActions}>
              {paymentResult.bankSlipUrl ? (
                <a 
                  href={paymentResult.bankSlipUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryButton}
                >
                  <span className={styles.buttonIcon}>📄</span>
                  Abrir Boleto
                </a>
              ) : (
                <div className={styles.errorMessage}>
                  ⚠️ URL do boleto não foi retornada pelo servidor
                </div>
              )}
            </div>

            <div className={styles.instructionsCard}>
              <div className={styles.instructionsHeader}>
                <span className={styles.instructionsIcon}>💡</span>
                <h4>Como pagar seu boleto</h4>
              </div>
              <div className={styles.instructionsList}>
                <div className={styles.instructionStep}>
                  <span className={styles.stepNumber}>1</span>
                  <span>Clique no botão "Abrir Boleto" acima</span>
                </div>
                <div className={styles.instructionStep}>
                  <span className={styles.stepNumber}>2</span>
                  <span>Faça o download ou imprima o boleto</span>
                </div>
                <div className={styles.instructionStep}>
                  <span className={styles.stepNumber}>3</span>
                  <span>Pague em qualquer banco, lotérica ou internet banking</span>
                </div>
                <div className={styles.instructionStep}>
                  <span className={styles.stepNumber}>4</span>
                  <span>O processamento leva 1-2 dias úteis após o pagamento</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className={styles.errorMessage}>
          ❌ {error}
        </div>
      )}

      {paymentMethod === 'card' && (
        <Elements stripe={stripePromise}>
          <CardPaymentForm
            totalPrice={totalPrice}
            paymentData={paymentData}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </Elements>
      )}

      {paymentMethod === 'pix' && (
        <div className={styles.paymentForm}>
          <div className={styles.pixFormSection}>
            <h4>🔷 Pagamento via PIX</h4>
            <div className={styles.pixDescription}>
              <p>Ao confirmar, será gerado um QR Code para pagamento instantâneo via PIX.</p>
              
              <div className={styles.paymentInfo}>
                <p><strong>Valor:</strong> R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p><strong>Processamento:</strong> Instantâneo</p>
                <p><strong>Disponível:</strong> 24h por dia, todos os dias</p>
              </div>
            </div>
            
            <button 
              onClick={handleNonCardPayment}
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? <>⏳ Processando...</> : <>🔷 Gerar PIX</>}
            </button>
          </div>
        </div>
      )}

      {paymentMethod === 'boleto' && (
        <div className={styles.paymentForm}>
          <div className={styles.boletoFormSection}>
            <h4>📄 Pagamento via Boleto</h4>
            <div className={styles.boletoDescription}>
              <p>Ao confirmar, será gerado um boleto bancário que você poderá imprimir ou pagar online.</p>
              
              <div className={styles.paymentInfo}>
                <p><strong>Valor:</strong> R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p><strong>Prazo:</strong> 3 dias úteis para pagamento</p>
                <p><strong>Processamento:</strong> 1-2 dias úteis após pagamento</p>
              </div>
            </div>
            
            <button 
              onClick={handleNonCardPayment}
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? <>⏳ Processando...</> : <>📄 Gerar Boleto</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}