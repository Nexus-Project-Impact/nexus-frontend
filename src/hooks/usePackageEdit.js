import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import packageService from '../services/packageService';

export function usePackageEdit(packageId) {
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
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    console.log('usePackageEdit - ID recebido:', packageId);
    
    if (packageId) {
      const fetchPackageData = async () => {
        setIsFetching(true);
        try {
          console.log('Buscando dados do pacote com ID:', packageId);
          const data = await packageService.getPackageById(packageId);
          console.log('Dados recebidos da API:', data);
          
          // Formatear as datas para o formato datetime-local do HTML
          const formatDateForInput = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toISOString().slice(0, 16); // formato YYYY-MM-DDTHH:mm
          };
          
          setPackageData({
            title: data.title || '',
            description: data.description || '',
            destination: data.destination || '',
            duration: data.duration || '',
            departureDate: formatDateForInput(data.departureDate),
            returnDate: formatDateForInput(data.returnDate),
            value: data.value || '',
            image: null // Arquivo não pode ser pré-carregado
          });
        } catch (error) {
          console.error("Erro ao buscar dados do pacote:", error);
          alert("Não foi possível carregar os dados do pacote.");
        } finally {
          setIsFetching(false);
        }
      };
      fetchPackageData();
    } else {
      console.log('Nenhum ID fornecido, não buscando dados');
      setIsFetching(false);
    }
  }, [packageId]);

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
      // Criar FormData para enviar a imagem (se houver)
      const formData = new FormData();
      formData.append('Title', packageData.title);
      formData.append('Description', packageData.description);
      formData.append('Destination', packageData.destination);
      formData.append('Duration', parseInt(packageData.duration));
      formData.append('DepartureDate', packageData.departureDate);
      formData.append('ReturnDate', packageData.returnDate);
      formData.append('Value', parseFloat(packageData.value));
      
      // Só adiciona a imagem se uma nova foi selecionada
      if (packageData.image) {
        formData.append('Image', packageData.image);
      }

      console.log("Atualizando pacote com ID:", packageId);
      console.log("Dados do pacote:", packageData);
      
      await packageService.updatePackage(packageId, formData);
      alert("Pacote atualizado com sucesso!");
      navigate('/admin/pacotes');
    } catch (error) {
      console.error('Erro ao atualizar pacote:', error);
      alert('Erro ao atualizar pacote. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return { packageData, isLoading, isFetching, handleChange, handleSubmit, setPackageData };
}
