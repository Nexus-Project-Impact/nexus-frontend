
const mockReservations = [
  { 
    id: 1, 
    userId: 1, 
    packageName: 'Fernando de Noronha', 
    date: '11 de ago, 2025', 
    status: 'Confirmada', 
    totalPrice: 4686,
    image: 'https://blog.assets.thediscoverer.com/2023/12/TD-Fernando-de-Noronha.jpg' 
  },
  { 
    id: 2, 
    userId: 1, 
    packageName: 'Jericoacoara', 
    date: '20 de set, 2025', 
    status: 'Pendente', 
    totalPrice: 3648,
    image: 'https://media-cdn.tripadvisor.com/media/photo-c/1280x250/14/10/2e/d9/jericoacoara.jpg'
  },
];

export const getReservationsByUserId = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reservations = mockReservations.filter(r => r.userId === userId);
      resolve(reservations);
    }, 500);
  });
};
