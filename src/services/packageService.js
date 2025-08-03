// Mock (dados de mentira) para nossos pacotes
let mockPackages = [
  { id: 1, 
    name: 'Fernando de Noronha',
    titlePackage: 'Mergulhe nas Águas Turquesa de Fernando de Noronha', 
    image: 'https://blog.assets.thediscoverer.com/2023/12/TD-Fernando-de-Noronha.jpg', 
    galleryPackage: [
      'https://blog.assets.thediscoverer.com/2023/12/TD-Fernando-de-Noronha.jpg',
      'https://blog.assets.thediscoverer.com/2023/12/TD-Fernando-de-Noronha.jpg',
      'https://blog.assets.thediscoverer.com/2023/12/TD-Fernando-de-Noronha.jpg',
      'https://blog.assets.thediscoverer.com/2023/12/TD-Fernando-de-Noronha.jpg',
      'https://blog.assets.thediscoverer.com/2023/12/TD-Fernando-de-Noronha.jpg',
    ],
    detailsPackage: {
    flight: { from: 'Aeroporto de Congonhas', to: 'Aeroporto de Fernando de Noronha', company: 'Azul', departureTime: '07:35', returnTime: '07:35' },
    hotel: { name: 'Paraíso do Boldró Flat', address: 'Rua Padre Gurgel, 172 - CEP: 00000-000' }
  },
    dates: '11 ago. 2025 à 16 ago. 2025',
    pricePackage: 4686 },
  { 
    id: 2, 
    name: 'Jericoacoara', 
    titlePackage: 'Descubra as Maravilhas de Jericoacoara',
    image: 'https://media-cdn.tripadvisor.com/media/photo-c/1280x250/14/10/2e/d9/jericoacoara.jpg',
    galleryPackage: [
      'https://media-cdn.tripadvisor.com/media/photo-c/1280x250/14/10/2e/d9/jericoacoara.jpg',
      'https://media-cdn.tripadvisor.com/media/photo-c/1280x250/14/10/2e/d9/jericoacoara.jpg',
      'https://media-cdn.tripadvisor.com/media/photo-c/1280x250/14/10/2e/d9/jericoacoara.jpg',
      'https://media-cdn.tripadvisor.com/media/photo-c/1280x250/14/10/2e/d9/jericoacoara.jpg',
      'https://media-cdn.tripadvisor.com/media/photo-c/1280x250/14/10/2e/d9/jericoacoara.jpg',
    ], 
    detailsPackage: {
      flight: { from: 'Aeroporto de Guarulhos', to: 'Aeroporto de Jericoacoara', company: 'Gol', departureTime: '08:00', returnTime: '18:30' },
      hotel: { name: 'Pousada do Norte', address: 'Rua Principal, 456 - CEP: 11111-111' }
    },
    dates: '09 ago. 2025 à 16 ago. 2025', 
    pricePackage: 3648 
  },
  { id: 3, 
    name: 'Porto de Galinhas', 
    titlePackage: 'Explore as Belezas de Porto de Galinhas',
    image: 'https://ipiranganews.inf.br/wp-content/uploads/VIAGEM3-30-11-21.jpg', 
    galleryPackage: [
      'https://ipiranganews.inf.br/wp-content/uploads/VIAGEM3-30-11-21.jpg',
      'https://ipiranganews.inf.br/wp-content/uploads/VIAGEM3-30-11-21.jpg',
      'https://ipiranganews.inf.br/wp-content/uploads/VIAGEM3-30-11-21.jpg',
      'https://ipiranganews.inf.br/wp-content/uploads/VIAGEM3-30-11-21.jpg',
      'https://ipiranganews.inf.br/wp-content/uploads/VIAGEM3-30-11-21.jpg',
    ], 
    detailsPackage: {
    flight: { from: 'Aeroporto de Congonhas', to: 'Aeroporto de Fernando de Noronha', company: 'Azul', departureTime: '07:35', returnTime: '07:35' },
    hotel: { name: 'Paraíso do Boldró Flat', address: 'Rua Padre Gurgel, 172 - CEP: 00000-000' }
  },
    dates: '11 ago. 2025 à 16 ago. 2025', 
    pricePackage: 5186 },
  { id: 4, 
    name: 'Cancún', 
    titlePackage: 'Descubra as Maravilhas de Cancún',
    image: 'https://www.cataloniahotels.com/en/blog/wp-content/uploads/2021/05/best-beaches-near-cancun.jpg', 
    galleryPackage: [
      'https://www.cataloniahotels.com/en/blog/wp-content/uploads/2021/05/best-beaches-near-cancun.jpg',
      'https://www.cataloniahotels.com/en/blog/wp-content/uploads/2021/05/best-beaches-near-cancun.jpg',
      'https://www.cataloniahotels.com/en/blog/wp-content/uploads/2021/05/best-beaches-near-cancun.jpg',
      'https://www.cataloniahotels.com/en/blog/wp-content/uploads/2021/05/best-beaches-near-cancun.jpg',
      'https://www.cataloniahotels.com/en/blog/wp-content/uploads/2021/05/best-beaches-near-cancun.jpg',
    ],
    detailsPackage: {
    flight: { from: 'Aeroporto de Guarulhos', to: 'Aeroporto de Fernando de Noronha', company: 'Azul', departureTime: '07:35', returnTime: '07:35' },
    hotel: { name: 'Paraíso do Boldró Flat', address: 'Rua Padre Gurgel, 172 - CEP: 00000-000' }
  },
    dates: '11 ago. 2025 à 16 ago. 2025',
    pricePackage: 4686 },
  { id: 5, 
    name: 'Punta Cana', 
    titlePackage: 'Descubra as Maravilhas de Punta Cana',
    image: 'https://blog.ostrovok.ru/wp-content/uploads/2021/11/22-1.jpg', 
    galleryPackage: [
      'https://blog.ostrovok.ru/wp-content/uploads/2021/11/22-1.jpg',
      'https://blog.ostrovok.ru/wp-content/uploads/2021/11/22-1.jpg',
      'https://blog.ostrovok.ru/wp-content/uploads/2021/11/22-1.jpg',
      'https://blog.ostrovok.ru/wp-content/uploads/2021/11/22-1.jpg',
      'https://blog.ostrovok.ru/wp-content/uploads/2021/11/22-1.jpg',
    ],
    detailsPackage: {
      flight: { from: 'Aeroporto de Guarulhos', to: 'Aeroporto de Fernando de Noronha', company: 'Azul', departureTime: '07:35', returnTime: '07:35' },
      hotel: { name: 'Paraíso do Boldró Flat', address: 'Rua Padre Gurgel, 172 - CEP: 00000-000' }
    },
    dates: '09 ago. 2025 à 16 ago. 2025',
    pricePackage: 3648 },
  { id: 6, 
    name: 'Orlando',
    titlePackage: 'Descubra as Maravilhas de Orlando',
    image: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1r9iWm.img?w=4064&h=2903&m=4&q=30',
    galleryPackage: [
      'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1r9iWm.img?w=4064&h=2903&m=4&q=30',
      'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1r9iWm.img?w=4064&h=2903&m=4&q=30',
      'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1r9iWm.img?w=4064&h=2903&m=4&q=30',
      'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1r9iWm.img?w=4064&h=2903&m=4&q=30',
      'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1r9iWm.img?w=4064&h=2903&m=4&q=30',
    ],
    detailsPackage: {
      flight: { from: 'Aeroporto de Guarulhos', to: 'Aeroporto de Fernando de Noronha', company: 'Azul', departureTime: '07:35', returnTime: '07:35' },
      hotel: { name: 'Paraíso do Boldró Flat', address: 'Rua Padre Gurgel, 172 - CEP: 00000-000' }
    },
    dates: '11 ago. 2025 à 16 ago. 2025',
    pricePackage: 4686 },
  {
    id: 7, 
    name: 'Sorocaba',
    titlePackage: 'A oitava maravilha do mundo',
    image: 'https://farm4.staticflickr.com/3864/15175563330_b8d566ff06_b.jpg',
    galleryPackage: [
      'https://farm4.staticflickr.com/3864/15175563330_b8d566ff06_b.jpg',
      'https://farm4.staticflickr.com/3864/15175563330_b8d566ff06_b.jpg',
      'https://farm4.staticflickr.com/3864/15175563330_b8d566ff06_b.jpg',
      'https://farm4.staticflickr.com/3864/15175563330_b8d566ff06_b.jpg',
      'https://farm4.staticflickr.com/3864/15175563330_b8d566ff06_b.jpg',
    ],
    detailsPackage: {
      flight: { from: 'Aeroporto de Viracopos', to: 'Aeroporto de Sorocaba', company: 'Voepass', departureTime: '10:00', returnTime: '11:00' },
      hotel: { name: 'Hotel Ipanema', address: 'Av. Ipanema, 123 - CEP: 22222-222' }
    },
    dates: '11 ago. 2025 à 16 ago. 2025',
    pricePackage: 4686
  },
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
          title: pkg.titlePackage,
          gallery: pkg.galleryPackage,
          description: pkg.detailsPackage,
          price: { original: 5186, current: pkg.pricePackage, installments: 12 }
        });
      } else {
        reject(new Error('Pacote não encontrado.'));
      }
    }, 500);
  });
};

export const deletePackageById = (id) => {
  return new Promise((resolve) => {
    // Filtra o array, mantendo todos os pacotes EXCETO o que tem o ID correspondente
    mockPackages = mockPackages.filter(p => p.id != id);
    setTimeout(() => {
      resolve({ success: true });
    }, 300);
  });
};