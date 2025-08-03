// DENTRO DE: src/pages/AdminAddPackagePage/hooks/useAddPackage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function usePackage() {
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState({
    name: '', image: '', dates: '', details: '', price: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPackageData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Salvando novo pacote:", packageData);
    // Simula o salvamento
    setTimeout(() => {
      setIsLoading(false);
      alert("Pacote salvo com sucesso! (Simulação)");
      navigate('/admin/pacotes'); // Volta para a lista
    }, 1000);
  };

  return { packageData, isLoading, handleChange, handleSubmit };
}