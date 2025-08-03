import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPackageById } from '../services/packageService';

export function usePackageEdit(packageId) {
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState({
    name: '',
    destination: '',
    image: '',
    gallery: [],
    dates: '',
    price: { current: 0, old: 0 },
    details: '',
    included: [],
    notIncluded: [],
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
          const data = await getPackageById(packageId);
          console.log('Dados recebidos da API:', data);
          setPackageData(data);
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
    const { name, value } = e.target;
    setPackageData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Salvando dados do pacote:", packageData);
    setTimeout(() => {
      setIsLoading(false);
      alert("Pacote salvo com sucesso! (Simulação)");
      navigate('/admin/pacotes');
    }, 1000);
  };

  return { packageData, isLoading, isFetching, handleChange, handleSubmit, setPackageData };
}
