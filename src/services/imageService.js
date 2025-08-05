// Serviço para lidar com URLs de imagens
const API_BASE_URL = 'https://localhost:7164';

/**
 * Constrói a URL completa da imagem baseada no caminho retornado pela API
 * @param {string} imagePath - Caminho da imagem retornado pela API (ex: "446c0e58-25d8-4cdb-ab39-43890aca9b19.jpg")
 * @returns {string} URL completa da imagem
 */
export const buildImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/src/assets/nexus-logo.png'; // Fallback
  }

  // Se já é uma URL completa, retorna como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Diferentes endpoints possíveis - teste estes em ordem de prioridade
  const possibleEndpoints = [
    `/images/${imagePath}`,
    `/uploads/${imagePath}`,
    `/Files/${imagePath}`,
    `/api/images/${imagePath}`,
    `/static/images/${imagePath}`,
    `/wwwroot/images/${imagePath}`
  ];
  
  // Por enquanto, usar o primeiro endpoint
  // Você pode ajustar conforme sua API
  return `${API_BASE_URL}${possibleEndpoints[0]}`;
};

/**
 * Extrai a URL da imagem de um objeto de reserva ou pacote
 * @param {object} data - Dados da reserva ou pacote
 * @returns {string} URL da imagem
 */
export const getPackageImageUrl = (data) => {
  if (!data) return '/src/assets/nexus-logo.png';

  // Buscar em diferentes propriedades possíveis
  const imagePath = 
    data.travelPackageImageUrl || 
    data.packageImage || 
    data.imageUrl || 
    data.image || 
    data.imagePackage ||
    data.fileName || // Caso a API retorne um fileName
    data.filePath;   // Caso a API retorne um filePath

  console.log('getPackageImageUrl - imagePath encontrado:', imagePath);
  console.log('getPackageImageUrl - data recebida:', data);

  return buildImageUrl(imagePath);
};

/**
 * Verifica se uma imagem existe no servidor
 * @param {string} imageUrl - URL da imagem
 * @returns {Promise<boolean>} Promise que resolve para true se a imagem existe
 */
export const checkImageExists = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};
