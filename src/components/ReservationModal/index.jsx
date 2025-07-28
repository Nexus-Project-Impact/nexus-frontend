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
                <input
                  type="text"
                  placeholder="RG"
                  value={traveler.rg}
                  onChange={(e) => handleTravelerChange(index, 'rg', e.target.value)}
                  className={styles.inputRg}
                />
              </div>
              <div className={styles.inputRow}>
                <input
                  type="text"
                  placeholder="CPF"
                  value={traveler.cpf}
                  onChange={(e) => handleTravelerChange(index, 'cpf', e.target.value)}
                  className={styles.inputHalf}
                />
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

        

        <button onClick={addTraveler} className={styles.addButton}>
          Adicionar Viajante
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