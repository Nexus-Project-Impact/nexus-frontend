// DENTRO DE: src/services/packageService.js

// Mock (dados de mentira) para nossos pacotes
const mockPackages = [
  { id: 1, name: 'Fernando de Noronha', image: 'https://images.unsplash.com/photo-1572494883907-273315a67451?q=80&w=1974&auto=format&fit=crop', details: 'Voo + Hospedagem', dates: '11 ago. 2025 - 16 ago. 2025' },
  { id: 2, name: 'Jericoacoara', image: 'https://images.unsplash.com/photo-1589923143484-754636952752?q=80&w=2070&auto=format&fit=crop', details: 'Voo + Hospedagem', dates: '09 ago. 2025 - 16 ago. 2025' },
  { id: 3, name: 'Porto de Galinhas', image: 'https://images.unsplash.com/photo-1616768399434-3c531191ad97?q=80&w=1974&auto=format&fit=crop', details: 'Voo + Hospedagem', dates: '11 ago. 2025 - 16 ago. 2025' },
  { id: 4, name: 'Cancún', image: 'https://images.unsplash.com/photo-1590523743825-0504d165c419?q=80&w=2070&auto=format&fit=crop', details: 'Voo + Hospedagem', dates: '11 ago. 2025 - 16 ago. 2025' },
  { id: 5, name: 'Punta Cana', image: 'https://images.unsplash.com/photo-1588992639209-4458543a6288?q=80&w=2070&auto=format&fit=crop', details: 'Voo + Hospedagem', dates: '09 ago. 2025 - 16 ago. 2025' },
  { id: 6, name: 'Orlando', image: 'https://images.unsplash.com/photo-1597466599227-9444239e7b23?q=80&w=2070&auto=format&fit=crop', details: 'Voo + Hospedagem', dates: '11 ago. 2025 - 16 ago. 2025' },
];

// Função que simula a busca dos pacotes
export const getPackages = (filters = {}) => {
  return new Promise((resolve) => {
    let filteredPackages = [...mockPackages];

    // Filtro por destino
    if (filters.destination) {
      filteredPackages = filteredPackages.filter(pkg =>
        pkg.name.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }

    setTimeout(() => {
      resolve(filteredPackages);
    }, 300);
  });
};

export const getPackageById = (id) => {
  return new Promise((resolve, reject) => {
    // O '==' é intencional aqui para não comparar tipos (string vs number)
    const pkg = mockPackages.find((p) => p.id == id);
    
    setTimeout(() => {
      if (pkg) {
        // Adicionando mais detalhes para a página de detalhes
        resolve({
          ...pkg,
          title: `Mergulhe nas Águas Turquesa de ${pkg.name}`,
          gallery: [
            pkg.image, // Imagem principal
            'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2000',
            'https://images.unsplash.com/photo-1516733978950-9c1691238446?q=80&w=2000',
            'https://images.unsplash.com/photo-1582719478212-c857e57693a2?q=80&w=2000',
            'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2000',
          ],
          description: {
            flight: { from: 'Aeroporto de Congonhas', to: `Aeroporto de ${pkg.name}`, company: 'Azul', departureTime: '07:35', returnTime: '07:35' },
            hotel: { name: 'Paraíso do Boldró Flat', address: 'Rua Padre Gurgel, 172 - CEP: 00000-000' }
          },
          price: { original: 5186, current: 4686, installments: 12 }
        });
      } else {
        reject(new Error('Pacote não encontrado.'));
      }
    }, 500);
  });
};