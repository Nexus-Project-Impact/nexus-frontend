import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import reservationService from '../../services/reservationService';
import styles from './ProfilePage.module.css';

// Sub-componente para os dados do usuário
function UserData({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user.name, email: user.email });

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);
  
  const handleSave = () => {
    console.log('Salvando dados:', formData);
    // Aqui iria a lógica para atualizar o estado do Redux ou chamar uma API
    setIsEditing(false);
  };

  return (
    <div>
      <h3>Meus Dados</h3>
      {!isEditing ? (
        <>
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={handleEdit} className={styles.button}>Editar</button>
        </>
      ) : (
        <>
          <label>Nome:</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={styles.input} />
          <label>Email:</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={styles.input} />
          <button onClick={handleSave} className={styles.button}>Salvar</button>
          <button onClick={handleCancel} className={`${styles.button} ${styles.buttonSecondary}`}>Cancelar</button>
        </>
      )}
    </div>
  );
}

// Sub-componente para as reservas
function MyReservations({ userId }) {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    reservationService.getById(userId).then(data => {
      setReservations(data);
      setIsLoading(false);
    });
  }, [userId]);

  if (isLoading) return <p>Carregando reservas...</p>;

  return (
    <div>
      <h3>Minhas Reservas</h3>
      {reservations.length === 0 ? (
        <p>Você ainda não fez nenhuma reserva.</p>
      ) : (
        <div className={styles.reservationsList}>
          {reservations.map(res => (
            <div key={res.id} className={styles.reservationCard}>
              <h4>{res.packageName}</h4>
              <p>Data: {res.date}</p>
              <p>Status: <span className={styles[res.status.toLowerCase()]}>{res.status}</span></p>
              <p>Valor: R$ {res.totalPrice.toLocaleString('pt-BR')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente principal da página de perfil
export function ProfilePage() {
  const [activeTab, setActiveTab] = useState('data'); // 'data' ou 'reservations'
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <p>Carregando informações do usuário...</p>;
  }

  return (
    <div className={styles.profileContainer}>
      <aside className={styles.sidebar}>
        <button onClick={() => setActiveTab('data')} className={activeTab === 'data' ? styles.active : ''}>
          Meus Dados
        </button>
        <button onClick={() => setActiveTab('reservations')} className={activeTab === 'reservations' ? styles.active : ''}>
          Minhas Reservas
        </button>
      </aside>
      <section className={styles.content}>
        {activeTab === 'data' && <UserData user={user} />}
        {activeTab === 'reservations' && <MyReservations userId={user.id} />}
      </section>
    </div>
  );
}