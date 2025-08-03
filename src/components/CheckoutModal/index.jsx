import React, { useState } from 'react';
import { useCheckout } from '../../hooks/useCheckout';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import styles from './CheckoutModal.module.css';

const stripePromise = loadStripe('sua-chave-publica-do-stripe');

export function CheckoutModal({ isOpen, onClose, packageData, travelers }) {
  const {
    totalPrice, installmentOptions, paymentMethod, setPaymentMethod,
    cardDetails, handleInputChange, installments, setInstallments,
    isLoading, handleFinalizePurchase, boletoData, pixData
  } = useCheckout(packageData, travelers);

const [copyText, setCopyText] = useState('Copiar código');

  if (!isOpen || !packageData || !travelers) return null;

  const handleCopy = () => {
    let textToCopy = '';
    if (boletoData?.barcode) {
      textToCopy = boletoData.barcode;
    } else if (pixData?.qrCode) {
      textToCopy = pixData.qrCode;
    }
    
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopyText('Copiado!');
      setTimeout(() => setCopyText('Copiar código'), 2000);
    }
  };

  return (
    <Elements stripe={stripePromise}>
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
            <label className={styles.radioLabel}>
              <input type="radio" name="paymentMethod" value="pix" checked={paymentMethod === 'pix'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <span>Pix</span>
            </label>
          </div>

          {paymentMethod === 'credit' && (
            <form className={styles.formGrid} onSubmit={handleFinalizePurchase}>
              {/* Formulário de Crédito (sem alterações) */}
              <input name="number" placeholder="Número do cartão" onChange={handleInputChange} className={styles.fullWidth} required />
              <input name="validity" placeholder="Validade (MM/AA)" onChange={handleInputChange} required />
              <input name="name" placeholder="Nome do Titular" onChange={handleInputChange} className={styles.fullWidth} required />
              <input name="cpf" placeholder="CPF do Titular" onChange={handleInputChange} required />
              <input name="cvv" placeholder="Código de Segurança" onChange={handleInputChange} required />
              <select value={installments} onChange={(e) => setInstallments(e.target.value)}>
                {installmentOptions.map(opt => (
                  <option key={opt.times} value={opt.times}>
                    {opt.times}x de R$ {opt.value.replace('.', ',')}
                  </option>
                ))}
              </select>
              <div className={styles.summary}>
                <h4>{packageData.name}</h4>
                <p>{travelers.length} viajante(s)</p>
                <p className={styles.totalPrice}>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <button type="submit" className={styles.buyButton} disabled={isLoading}>
                {isLoading ? 'Processando...' : 'Finalizar Compra'}
              </button>
            </form>
          )}

          {paymentMethod === 'debit' && (
            <form className={styles.formGrid} onSubmit={handleFinalizePurchase}>
              <input name="number" placeholder="Número do cartão de débito" onChange={handleInputChange} className={styles.fullWidth} required />
              <input name="validity" placeholder="Validade (MM/AA)" onChange={handleInputChange} required />
              <input name="name" placeholder="Nome do Titular" onChange={handleInputChange} className={styles.fullWidth} required />
              <input name="cpf" placeholder="CPF do Titular" onChange={handleInputChange} required />
              <input name="cvv" placeholder="Código de Segurança" onChange={handleInputChange} required />
              
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
            // Se o boleto AINDA NÃO foi gerado, mostra a tela de confirmação
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
              // Se o boleto JÁ FOI gerado, mostra os dados dele
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
          {paymentMethod === 'pix' && (
            // Se o PIX AINDA NÃO foi gerado, mostra a tela de confirmação
            !pixData ? (
              <form className={styles.pixConfirmation} onSubmit={handleFinalizePurchase}>
                <h3>Pagamento com Pix</h3>
                <div className={styles.summary}>
                  <h4>{packageData.name}</h4>
                  <p>{travelers.length} viajante(s)</p>
                  <p className={styles.totalPrice}>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <button type="submit" className={styles.buyButton} disabled={isLoading}>
                  {isLoading ? 'Gerando...' : 'Gerar Pix'}
                </button>
              </form>
            ) : (
              // Se o PIX JÁ FOI gerado, mostra os dados dele
              <div className={styles.pixGenerated}>
                <h3>Pix Gerado com Sucesso!</h3>
                <p>Use o código PIX abaixo para pagar no seu app do banco ou PIX.</p>
                <div className={styles.barcodeWrapper}>
                  <input type="text" readOnly value={pixData.qrCode} className={styles.barcodeInput} />
                  <button type="button" onClick={handleCopy} className={styles.copyButton}>
                    {copyText}
                  </button>
                </div>
                <p className={styles.dueDate}>
                  {pixData.dueDate} (expira às {pixData.expiryTime})
                </p>
                <button onClick={onClose} className={styles.buyButton}>
                  Concluir
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
    </Elements>
  );
}