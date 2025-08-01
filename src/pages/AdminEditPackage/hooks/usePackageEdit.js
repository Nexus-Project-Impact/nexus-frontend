// DENTRO DE: src/pages/AdminAddPackagePage/hooks/useAddPackage.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPackageById } from '../../../services/packageService'; // Importa o serviço

export function usePackageEdit(packageId) { // Recebe o ID do pacote
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
  const [isLoading, setIsLoading] = useState(false); // Para o submit do form
  const [isFetching, setIsFetching] = useState(true); // Para o carregamento inicial

  useEffect(() => {
    console.log('usePackageEdit - ID recebido:', packageId);
    
    if (packageId) {
      const fetchPackageData = async () => {
        setIsFetching(true);
        try {
          console.log('Buscando dados do pacote com ID:', packageId);
          const data = await getPackageById(packageId);
          console.log('Dados recebidos da API:', data);
          setPackageData(data); // Popula o estado com os dados do pacote
        } catch (error) {
          console.error("Erro ao buscar dados do pacote:", error);
          alert("Não foi possível carregar os dados do pacote.");
        } finally {
          setIsFetching(false);
        }
      };
      fetchPackageData();
    } else {
      // Se não há ID, é um novo pacote, então não busca nada
      console.log('Nenhum ID fornecido, não buscando dados');
      setIsFetching(false);
    }
  }, [packageId]); // Roda o efeito quando o ID muda

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPackageData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // A lógica de salvar (criar ou atualizar) viria aqui
    console.log("Salvando dados do pacote:", packageData);
    setTimeout(() => {
      setIsLoading(false);
      alert("Pacote salvo com sucesso! (Simulação)");
      navigate('/admin/pacotes');
    }, 1000);
  };

  // Retorna o novo estado de isFetching também
  return { packageData, isLoading, isFetching, handleChange, handleSubmit, setPackageData };
}