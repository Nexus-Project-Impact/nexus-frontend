import React from 'react';
import { useReservation } from './hooks/useReservation';
import styles from './ReservationModal.module.css';

export function ReservationModal({ isOpen, onClose, onSaveAndProceed }) {
  const { travelers, isLoading, handleTravelerChange, addTraveler, handleSave, removeTraveler } = useReservation(onSaveAndProceed);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>Dados da Reserva</h2>

        <div className={styles.travelersList}>
          {travelers.map((traveler, index) => (
            
            <div key={traveler.id} className={styles.travelerForm}>
                {index > 0 && ( // Só mostra o botão se não for o primeiro item (index 0)
                <button 
                  type="button" 
                  className={styles.removeButton} 
                  onClick={() => removeTraveler(traveler.id)}
                >
                  ×
                </button>
              )}
              {/* ... seus inputs para Nome, RG, CPF, etc. ... */}
              <div className={styles.inputRow}>
                <input
                  type="text"
                  placeholder={index === 0 ? "Nome do titular" : "Nome do acompanhante"}
                  value={traveler.name}
                  onChange={(e) => handleTravelerChange(index, 'name', e.target.value)}
                  className={styles.inputName}
                />
                <div className={styles.inputWithValidation}>
                  <input
                    type="text"
                    placeholder="RG "
                    value={traveler.rg}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 9) {
                        // Formata RG: XX.XXX.XXX-X
                        value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
                        handleTravelerChange(index, 'rg', value);
                      }
                    }}
                    className={`${styles.inputRg} ${traveler.rg && traveler.rg.replace(/\D/g, '').length !== 9 ? styles.inputError : ''}`}
                  />
                  {traveler.rg && traveler.rg.replace(/\D/g, '').length !== 9 && (
                    <span className={styles.validationMessage}>
                      RG deve ter 9 dígitos
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputWithValidation}>
                  <input
                    type="text"
                    placeholder="CPF"
                    value={traveler.cpf}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 11) {
                        // Formata CPF: XXX.XXX.XXX-XX
                        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                        handleTravelerChange(index, 'cpf', value);
                      }
                    }}
                    className={`${styles.inputHalf} ${traveler.cpf && traveler.cpf.replace(/\D/g, '').length !== 11 ? styles.inputError : ''}`}
                  />
                  {traveler.cpf && traveler.cpf.replace(/\D/g, '').length !== 11 && (
                    <span className={styles.validationMessage}>
                      CPF deve ter 11 dígitos
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  placeholder="Data de Nascimento"
                  value={traveler.dob}
                  onChange={(e) => handleTravelerChange(index, 'dob', e.target.value)}
                  className={styles.inputHalf}
                />
              </div>
            </div>
          ))}
        </div>

        {travelers.length >= 5 && (
          <div className={styles.limitMessage}>
            Limite máximo de 5 viajantes atingido
          </div>
        )}

        <button 
          onClick={addTraveler} 
          className={styles.addButton}
          disabled={travelers.length >= 5}
        >
          Adicionar viajante
        </button>

        <div className={styles.footer}>
          <button onClick={handleSave} className={styles.saveButton} disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Confirmar Reserva'}
          </button>
        </div>
      </div>
    </div>
  );
}