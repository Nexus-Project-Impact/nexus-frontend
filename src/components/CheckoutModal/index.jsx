import React from 'react';
import { useCheckout } from '../../hooks/useCheckout';
import { StripeEmbeddedForm } from './components/StripeEmbeddedForm';
import { PaymentForm } from './components/PaymentForm';
import styles from './CheckoutModal.module.css';

export function CheckoutModal({ isOpen, onClose, packageData, travelers }) {
  const {
    totalPrice,
    paymentMethod,
    setPaymentMethod
  } = useCheckout(packageData, travelers);

  if (!isOpen || !packageData || !travelers) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>Pagamento</h2>

        <div className={styles.scrollableContent}>
          <div className={styles.paymentOptions}>
            <label className={styles.radioLabel}>
              <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <span>Cartão de Crédito/Débito</span>
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="paymentMethod" value="pix" checked={paymentMethod === 'pix'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <span>PIX</span>
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="paymentMethod" value="boleto" checked={paymentMethod === 'boleto'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <span>Boleto</span>
            </label>
          </div>

          {/* --- Renderização Condicional do Conteúdo --- */}

          {/* Cartão de Crédito/Débito */}
          {paymentMethod === 'card' && (
            <PaymentForm 
              paymentMethod="card"
              totalPrice={totalPrice}
              packageData={packageData}
              travelers={travelers}
              onClose={onClose}
            />
          )}

          {/* PIX */}
          {paymentMethod === 'pix' && (
            <PaymentForm 
              paymentMethod="pix"
              totalPrice={totalPrice}
              packageData={packageData}
              travelers={travelers}
              onClose={onClose}
            />
          )}

          {/* Boleto */}
          {paymentMethod === 'boleto' && (
            <PaymentForm 
              paymentMethod="boleto"
              totalPrice={totalPrice}
              packageData={packageData}
              travelers={travelers}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}