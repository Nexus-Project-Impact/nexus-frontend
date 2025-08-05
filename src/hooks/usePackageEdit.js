import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { convertBRDateToISO, convertISODateToBR, formatCurrencyInput, parseCurrencyInput } from '../utils/formatters';
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
          
          setPackageData({
            title: data.title || '',
            description: data.description || '',
            destination: data.destination || '',
            duration: data.duration || '',
            departureDate: convertISODateToBR(data.departureDate),
            returnDate: convertISODateToBR(data.returnDate),
            value: data.value ? formatCurrencyInput(data.value.toString()) : '',
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
      // Converter datas do formato brasileiro para ISO
      const departureISO = convertBRDateToISO(packageData.departureDate);
      const returnISO = convertBRDateToISO(packageData.returnDate);
      
      // Converter valor formatado para número decimal
      const valueDecimal = parseCurrencyInput(packageData.value);
      
      let dataToSend;
      
      // Se há uma nova imagem, usar FormData
      if (packageData.image) {
        console.log("Enviando com nova imagem (FormData)");
        const formData = new FormData();
        formData.append('Title', packageData.title);
        formData.append('Description', packageData.description);
        formData.append('Destination', packageData.destination);
        formData.append('Duration', parseInt(packageData.duration));
        formData.append('DepartureDate', departureISO);
        formData.append('ReturnDate', returnISO);
        formData.append('Value', valueDecimal);
        formData.append('Image', packageData.image);
        dataToSend = formData;
      } else {
        // Se não há nova imagem, enviar JSON
        console.log("Enviando sem nova imagem (JSON)");
        dataToSend = {
          title: packageData.title,
          description: packageData.description,
          destination: packageData.destination,
          duration: parseInt(packageData.duration),
          departureDate: departureISO,
          returnDate: returnISO,
          value: valueDecimal
        };
      }

      console.log("Atualizando pacote com ID:", packageId);
      console.log("Dados do pacote:", packageData);
      console.log("Datas convertidas - Partida:", departureISO, "Retorno:", returnISO);
      console.log("Valor convertido:", valueDecimal);
      console.log("Tipo de dados enviados:", packageData.image ? 'FormData' : 'JSON');
      
      await packageService.updatePackage(packageId, dataToSend);
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
