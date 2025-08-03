
const mockReservations = [
  { 
    id: 1, 
    userId: 1, 
    clientName: 'João Silva',
    clientPhone: '11 99999-9999',
    clientEmail: 'joao.silva@example.com',
    packageName: 'Fernando de Noronha', 
    travelDate: '11 de ago, 2025', 
    reservationDate: '15 de jul, 2025',
    paymentStatus: 'Pago', 
    totalPrice: 4686,
    image: 'https://blog.assets.thediscoverer.com/2023/12/TD-Fernando-de-Noronha.jpg' 
  },
  { 
    id: 2, 
    userId: 2,
    clientName: 'Maria Santos', 
    clientPhone: '11 98888-8888',
    clientEmail: 'maria.santos@example.com',
    packageName: 'Jericoacoara', 
    travelDate: '20 de set, 2025', 
    reservationDate: '10 de jul, 2025',
    paymentStatus: 'Pendente', 
    totalPrice: 3648,
    image: 'https://media-cdn.tripadvisor.com/media/photo-c/1280x250/14/10/2e/d9/jericoacoara.jpg'
  },
  { 
    id: 3, 
    userId: 3,
    clientName: 'Pedro Oliveira', 
    clientPhone: '11 97777-7777',
    clientEmail: 'pedro.oliveira@example.com',
    packageName: 'Porto de Galinhas', 
    travelDate: '05 de out, 2025', 
    reservationDate: '20 de jul, 2025',
    paymentStatus: 'Pago', 
    totalPrice: 5186,
    image: 'https://ipiranganews.inf.br/wp-content/uploads/VIAGEM3-30-11-21.jpg'
  },
  { 
    id: 4, 
    userId: 4,
    clientName: 'Ana Costa', 
    clientPhone: '11 96666-6666',
    clientEmail: 'ana.costa@example.com',
    packageName: 'Cancún', 
    travelDate: '15 de nov, 2025', 
    reservationDate: '25 de jul, 2025',
    paymentStatus: 'Cancelado', 
    totalPrice: 4686,
    image: 'https://www.cataloniahotels.com/en/blog/wp-content/uploads/2021/05/best-beaches-near-cancun.jpg'
  },
  { 
    id: 5, 
    userId: 5,
    clientName: 'Carlos Ferreira', 
    clientPhone: '11 95555-5555',
    clientEmail: 'carlos.ferreira@example.com',
    packageName: 'Punta Cana', 
    travelDate: '12 de dez, 2025', 
    reservationDate: '30 de jul, 2025',
    paymentStatus: 'Pago', 
    totalPrice: 3648,
    image: 'https://blog.ostrovok.ru/wp-content/uploads/2021/11/22-1.jpg'
  }
];

export const getReservationsByUserId = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reservations = mockReservations.filter(r => r.userId === userId);
      resolve(reservations);
    }, 500);
  });
};

export const getAllReservations = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockReservations);
    }, 500);
  });
};

export const getReservationById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const reservation = mockReservations.find(r => r.id == id);
      if (reservation) {
        resolve(reservation);
      } else {
        reject(new Error('Reserva não encontrada.'));
      }
    }, 500);
  });
};
