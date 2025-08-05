// DENTRO DE: src/pages/AdminAddPackagePage/hooks/useAddPackage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import packageService from '../services/packageService';

export function usePackage() {
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState({
    title: '',
    description: '',
    destination: '',
    duration: '',
    departureDate: '',
    returnDate: '',
    value: '',
    image: null
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setPackageData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setPackageData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Criar FormData para enviar a imagem
      const formData = new FormData();
      formData.append('Title', packageData.title);
      formData.append('Description', packageData.description);
      formData.append('Destination', packageData.destination);
      formData.append('Duration', parseInt(packageData.duration));
      formData.append('DepartureDate', packageData.departureDate);
      formData.append('ReturnDate', packageData.returnDate);
      formData.append('Value', parseFloat(packageData.value));
      
      if (packageData.image) {
        formData.append('Image', packageData.image);
      }

      console.log("Enviando novo pacote:", packageData);
      
      await packageService.createPackage(formData);
      alert("Pacote criado com sucesso!");
      navigate('/admin/pacotes');
    } catch (error) {
      console.error('Erro ao criar pacote:', error);
      alert('Erro ao criar pacote. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return { packageData, isLoading, handleChange, handleSubmit };
}