import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './MinhasReservas.module.css';

// Dados mockados de reservas
const mockReservations = [
  {
    id: 1,
    packageId: 1,
    packageName: 'Fernando de Noronha',
    packageImage: 'https://blog.assets.thediscoverer.com/2023/12/TD-Fernando-de-Noronha.jpg',
    dates: '11 ago. 2025 à 16 ago. 2025',
    travelers: [
      { name: 'Maria Silva', document: '123.456.789-00', phone: '(11) 99999-9999' },
      { name: 'João Silva', document: '987.654.321-00', phone: '(11) 88888-8888' }
    ],
    totalAmount: 9372, // 2 pessoas × 4686
    bookingDate: '2025-07-15T10:30:00',
    status: 'confirmada',
    hasReview: false,
    flight: {
      from: 'Aeroporto de Congonhas',
      to: 'Aeroporto de Fernando de Noronha',
      company: 'Azul',
      departureTime: '07:35',
      returnTime: '07:35'
    },
    hotel: {
      name: 'Paraíso do Boldró Flat',
      address: 'Rua Padre Gurgel, 172 - CEP: 00000-000'
    }
  },
  {
    id: 2,
    packageId: 2,
    packageName: 'Jericoacoara',
    packageImage: 'https://media-cdn.tripadvisor.com/media/photo-c/1280x250/14/10/2e/d9/jericoacoara.jpg',
    dates: '09 ago. 2025 à 16 ago. 2025',
    travelers: [
      { name: 'Maria Silva', document: '123.456.789-00', phone: '(11) 99999-9999' }
    ],
    totalAmount: 3648,
    bookingDate: '2025-07-10T14:20:00',
    status: 'finalizada', // Viagem já realizada
    hasReview: false,
    flight: {
      from: 'Aeroporto de Guarulhos',
      to: 'Aeroporto de Jericoacoara',
      company: 'Gol',
      departureTime: '08:00',
      returnTime: '18:30'
    },
    hotel: {
      name: 'Pousada do Norte',
      address: 'Rua Principal, 456 - CEP: 11111-111'
    }
  },
  {
    id: 3,
    packageId: 3,
    packageName: 'Porto de Galinhas',
    packageImage: 'https://ipiranganews.inf.br/wp-content/uploads/VIAGEM3-30-11-21.jpg',
    dates: '20 jul. 2025 à 27 jul. 2025',
    travelers: [
      { name: 'Maria Silva', document: '123.456.789-00', phone: '(11) 99999-9999' },
      { name: 'Ana Silva', document: '456.789.123-00', phone: '(11) 77777-7777' }
    ],
    totalAmount: 10372,
    bookingDate: '2025-06-20T09:15:00',
    status: 'finalizada',
    hasReview: true, // Já tem avaliação
    flight: {
      from: 'Aeroporto de Congonhas',
      to: 'Aeroporto de Recife',
      company: 'Azul',
      departureTime: '07:35',
      returnTime: '19:45'
    },
    hotel: {
      name: 'Resort Paradise',
      address: 'Rua das Palmeiras, 789 - CEP: 22222-222'
    }
  }
];

export function MinhasReservas() {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se está logado
    if (!token) {
      navigate('/login');
      return;
    }

    // Simular carregamento
    setTimeout(() => {
      setReservations(mockReservations);
      setIsLoading(false);
    }, 1000);
  }, [token, navigate]);

  const handleReviewClick = (reservationId, packageId) => {
    // Navegar para a página de adicionar avaliação
    navigate(`/avaliar/${packageId}`, { 
      state: { 
        reservationId, 
        fromReservations: true 
      } 
    });
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      'confirmada': { text: 'Confirmada', class: 'confirmed' },
      'finalizada': { text: 'Finalizada', class: 'finished' },
      'cancelada': { text: 'Cancelada', class: 'cancelled' }
    };
    return statusMap[status] || { text: status, class: 'default' };
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Minhas Reservas</h1>
        <div className={styles.loading}>Carregando suas reservas...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Minhas Reservas</h1>

      {reservations.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>Nenhuma reserva encontrada</h3>
          <p>Que tal explorar nossos destinos incríveis?</p>
          <button onClick={() => navigate('/pacotes')} className={styles.exploreButton}>
            Explorar Pacotes
          </button>
        </div>
      ) : (
        <div className={styles.reservationsList}>
          {reservations.map((reservation) => {
            return (
              <div key={reservation.id} className={styles.reservationCard}>
                <div className={styles.cardHeader}>
                  <img 
                    src={reservation.packageImage} 
                    alt={reservation.packageName}
                    className={styles.packageImage}
                  />
                  <div className={styles.packageInfo}>
                    <h3 className={styles.packageName}>{reservation.packageName}</h3>
                    <p className={styles.packageDates}>{reservation.dates}</p>
                  </div>
                  <div className={styles.cardActions}>
                    {!reservation.hasReview ? (
                      <button 
                        className={styles.reviewButton}
                        onClick={() => handleReviewClick(reservation.id, reservation.packageId)}
                      >
                        Avaliar Viagem
                      </button>
                    ) : (
                      <button className={styles.reviewedButton}>
                        ✓ Avaliado
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
