import React from 'react';
import { useCheckout } from './hooks/useCheckout';
import styles from './CheckoutModal.module.css';

export function CheckoutModal({ isOpen, onClose, packageData, travelers }) {
  const {
    totalPrice, installmentOptions, paymentMethod, setPaymentMethod,
    cardDetails, handleInputChange, installments, setInstallments,
    isLoading, handleFinalizePurchase,
  } = useCheckout(packageData, travelers);

  if (!isOpen || !packageData || !travelers) return null; // Verificação de segurança

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>Pagamento</h2>

        {/* ✅ DIV PARA A BARRA DE ROLAGEM */}
        <div className={styles.scrollableContent}>

          {/* ✅ OPÇÕES DE PAGAMENTO */}
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

          {paymentMethod === 'credit' && (
            <form className={styles.formGrid} onSubmit={handleFinalizePurchase}>
              {/* Campos do Cartão */}
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
              
              {/* ✅ DADOS SIMPLIFICADOS DO PACOTE E VIAJANTES */}
              <div className={styles.summary}>
                <h4>{packageData.name}</h4>
                <p>{packageData.dates}</p>
                <p>{travelers.length} viajante(s)</p>
                <p className={styles.totalPrice}>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>

              <button type="submit" className={styles.buyButton} disabled={isLoading}>
                {isLoading ? 'Processando...' : 'Finalizar Compra'}
              </button>
            </form>
          )}

          {paymentMethod === 'debit' && <div className={styles.placeholder}>Opção de Débito em desenvolvimento.</div>}
          {paymentMethod === 'boleto' && <div className={styles.placeholder}>Opção de Boleto em desenvolvimento.</div>}
        </div>
      </div>
    </div>
  );
}