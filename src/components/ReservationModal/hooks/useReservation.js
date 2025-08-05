import { useState } from 'react';
import { useSelector } from 'react-redux';

export function useReservation(onSaveAndProceed) {
  const { user } = useSelector((state) => state.auth);

  // Começa com o usuário logado como o primeiro viajante
  const initialTraveler = {
    id: 1,
    name: user?.name || '',
    rg: '',
    cpf: '',
    dob: '', // Data de Nascimento (Date of Birth)
  };

  const [travelers, setTravelers] = useState([initialTraveler]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // A chave para o formulário dinâmico
  const handleTravelerChange = (index, field, value) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index][field] = value;
    setTravelers(updatedTravelers);
  };

  const addTraveler = () => {
    if (travelers.length >= 5) {
      return; // Não adiciona se já tem 5 viajantes
    }
    setTravelers([
      ...travelers,
      { id: travelers.length + 1, name: '', rg: '', cpf: '', dob: '' },
    ]);
  };

  const removeTraveler = (idToRemove) => {
    // Só permite remover se houver mais de um viajante
    if (travelers.length <= 1) return; 

    // O filter cria um NOVO array com todos os itens, exceto aquele com o ID a ser removido
    setTravelers(travelers.filter(traveler => traveler.id !== idToRemove));
  };

  const handleSave = () => {
    setIsLoading(true);
    setError(null);
    // Lógica de validação (ex: verificar se todos os campos estão preenchidos)
  if (onSaveAndProceed) {
      onSaveAndProceed(travelers);
    }
  };

  return { travelers, isLoading, error, handleTravelerChange, addTraveler, handleSave, removeTraveler };
}