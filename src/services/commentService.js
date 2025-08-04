let mockComments = [
  { 
    id: 101, 
    reservationId: 1, 
    destination: 'Fernando de Noronha', 
    customerId: 1, 
    customerName: 'João Silva',
    commentText: 'A viagem foi absolutamente incrível! As praias são paradisíacas e a organização foi impecável. Recomendo a todos!'
  },
  { 
    id: 102, 
    reservationId: 2, 
    destination: 'Jericoacoara', 
    customerId: 2, 
    customerName: 'Maria Santos',
    commentText: 'Lugar maravilhoso, mas o hotel poderia ter um café da manhã melhor. A parte dos passeios foi ótima.'
  },
  {
    id: 103,
    reservationId: 3,
    destination: 'Porto de Galinhas',
    customerId: 3,
    customerName: 'Pedro Oliveira',
    commentText: 'Excelente custo-benefício. O voo foi tranquilo e a hospedagem era muito perto da praia. Perfeito para famílias.'
  }
];

// Função para buscar todos os comentários
export const getComments = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockComments);
    }, 500);
  });
};

export const deleteCommentById = (id) => {
  return new Promise((resolve) => {
    mockComments = mockComments.filter(c => c.id !== id);
    setTimeout(() => {
      resolve({ success: true });
    }, 300);
  });
};