// Serviço para gerenciar URLs de imagens de pacotes
class ImageService {
  constructor() {
    this.baseURL = 'https://localhost:7164';
  }

  // Construir URL da imagem do pacote
  getPackageImageUrl(packageId, packageData = null) {
    // Se já tem uma URL válida nos dados do pacote, usar ela
    if (packageData?.imageUrl && this.isValidUrl(packageData.imageUrl)) {
      return packageData.imageUrl;
    }
    
    if (packageData?.image && this.isValidUrl(packageData.image)) {
      return packageData.image;
    }

    // Se não tem URL válida, tentar construir baseado no ID
    const possiblePaths = [
      `/api/TravelPackageControler/Image/${packageId}`,
      `/api/images/${packageId}`,
      `/uploads/${packageId}.jpg`,
      `/uploads/${packageId}.png`,
      `/images/${packageId}.jpg`,
      `/images/${packageId}.png`,
      `/Files/${packageId}.jpg`,
      `/Files/${packageId}.png`,
      `/api/files/${packageId}`
    ];

    // Por enquanto, retornar a primeira opção mais provável
    return `${this.baseURL}${possiblePaths[0]}`;
  }

  // Verificar se uma string é uma URL válida
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Tentar múltiplas URLs até encontrar uma que funcione
  async findWorkingImageUrl(packageId, packageData = null) {
    const possibleUrls = [
      // URLs dos dados do pacote
      packageData?.imageUrl,
      packageData?.image,
      packageData?.imagePackage,
      // URLs construídas
      `${this.baseURL}/api/TravelPackageControler/Image/${packageId}`,
      `${this.baseURL}/api/images/${packageId}`,
      `${this.baseURL}/uploads/${packageId}.jpg`,
      `${this.baseURL}/uploads/${packageId}.png`,
      `${this.baseURL}/images/${packageId}.jpg`,
      `${this.baseURL}/images/${packageId}.png`,
      `${this.baseURL}/Files/${packageId}.jpg`,
      `${this.baseURL}/Files/${packageId}.png`
    ].filter(url => url); // Remove valores null/undefined

    for (const url of possibleUrls) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          console.log(`Imagem encontrada em: ${url}`);
          return url;
        }
      } catch (error) {
        // Continua tentando a próxima URL
        continue;
      }
    }

    // Se nenhuma URL funcionou, retorna a primeira como fallback
    console.log(`Nenhuma imagem encontrada para o pacote ${packageId}, usando fallback`);
    return possibleUrls[0] || `${this.baseURL}/api/images/${packageId}`;
  }
}

const imageService = new ImageService();
export default imageService;
