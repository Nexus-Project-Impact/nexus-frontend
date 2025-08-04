import React, { useState } from 'react';
import { useCheckout } from './hooks/useCheckout';
import { StripeEmbeddedForm } from './components/StripeEmbeddedForm';
import styles from './CheckoutModal.module.css';

export function CheckoutModal({ isOpen, onClose, packageData, travelers }) {
  const {
    totalPrice,
    paymentMethod,
    setPaymentMethod,
    isLoading,
    handleFinalizePurchase,
    boletoData
  } = useCheckout(packageData, travelers);

  const [copyText, setCopyText] = useState('Copiar código');

  if (!isOpen || !packageData || !travelers) return null;

  const handleCopy = () => {
    if (boletoData?.barcode) {
      navigator.clipboard.writeText(boletoData.barcode);
      setCopyText('Copiado!');
      setTimeout(() => setCopyText('Copiar código'), 2000);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>Pagamento</h2>

        <div className={styles.scrollableContent}>
          <div className={styles.paymentOptions}>
            <label className={styles.radioLabel}>
              <input type="radio" name="paymentMethod" value="credit" checked={paymentMethod === 'credit'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <span>Cartão de Crédito</span>
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="paymentMethod" value="debit" checked={paymentMethod === 'debit'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <span>Débito</span>
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="paymentMethod" value="boleto" checked={paymentMethod === 'boleto'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <span>Boleto</span>
            </label>
          </div>

          {/* --- Renderização Condicional do Conteúdo --- */}

          {paymentMethod === 'credit' && (
            <StripeEmbeddedForm totalPrice={totalPrice} />
          )}

          {paymentMethod === 'debit' && (
            <form className={styles.formGrid} onSubmit={handleFinalizePurchase}>
              <input name="number" placeholder="Número do cartão de débito" className={styles.fullWidth} required />
              <input name="validity" placeholder="Validade (MM/AA)" required />
              <input name="name" placeholder="Nome do Titular" className={styles.fullWidth} required />
              <input name="cpf" placeholder="CPF do Titular" required />
              <input name="cvv" placeholder="Código de Segurança" required />
              <div className={`${styles.summary} ${styles.summaryDebit}`}>
                <h4>{packageData.name}</h4>
                <p>{travelers.length} viajante(s)</p>
                <p>Pagamento à vista</p>
                <p className={styles.totalPrice}>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <button type="submit" className={styles.buyButton} disabled={isLoading}>
                {isLoading ? 'Processando...' : 'Finalizar Compra'}
              </button>
            </form>
          )}

          {paymentMethod === 'boleto' && (
            !boletoData ? (
              <form className={styles.boletoConfirmation} onSubmit={handleFinalizePurchase}>
                <h3>Pagamento com Boleto</h3>
                <p>O boleto será gerado com os seus dados e terá vencimento em 3 dias úteis.</p>
                <div className={styles.summary}>
                  <h4>{packageData.name}</h4>
                  <p>{travelers.length} viajante(s)</p>
                  <p className={styles.totalPrice}>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <button type="submit" className={styles.buyButton} disabled={isLoading}>
                  {isLoading ? 'Gerando...' : 'Gerar Boleto'}
                </button>
              </form>
            ) : (
              <div className={styles.boletoGenerated}>
                <h3>Boleto Gerado com Sucesso!</h3>
                <p>Use o código de barras abaixo para pagar no seu app do banco.</p>
                <div className={styles.barcodeWrapper}>
                  <input type="text" readOnly value={boletoData.barcode} className={styles.barcodeInput} />
                  <button type="button" onClick={handleCopy} className={styles.copyButton}>
                    {copyText}
                  </button>
                </div>
                <p className={styles.dueDate}>{boletoData.dueDate}</p>
                <button onClick={onClose} className={styles.buyButton}>
                  Concluir
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}