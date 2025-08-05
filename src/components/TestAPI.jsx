import React, { useState, useEffect } from 'react';
import api from '../services/api';
import reservationService from '../services/reservationService';
import packageService from '../services/packageService';

export function TestAPI() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testReservations = async () => {
    setLoading(true);
    try {
      console.log('=== TESTE: Chamando getUserReservations ===');
      const reservations = await reservationService.getUserReservations();
      console.log('Reservas recebidas:', reservations);
      console.log('Type of reservations:', typeof reservations);
      console.log('Is Array:', Array.isArray(reservations));
      
      if (reservations && reservations.length > 0) {
        console.log('Primeira reserva:', reservations[0]);
        console.log('Campos da primeira reserva:', Object.keys(reservations[0]));
        
        // Se tem travelPackageId, buscar dados do pacote
        if (reservations[0].travelPackageId) {
          console.log('=== TESTE: Buscando dados do pacote ===');
          const packageData = await packageService.getPackageById(reservations[0].travelPackageId);
          console.log('Dados do pacote:', packageData);
          if (packageData) {
            console.log('Campos do pacote:', Object.keys(packageData));
          }
        }
      }
      
      setResult(reservations);
    } catch (error) {
      console.error('Erro no teste de reservas:', error);
      setResult(`ERRO: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testPackages = async () => {
    setLoading(true);
    try {
      console.log('=== TESTE: Chamando getPackages ===');
      const packages = await packageService.getPackages();
      console.log('Pacotes recebidos:', packages);
      console.log('Type of packages:', typeof packages);
      console.log('Is Array:', Array.isArray(packages));
      
      if (packages && packages.length > 0) {
        console.log('Primeiro pacote:', packages[0]);
        console.log('Campos do primeiro pacote:', Object.keys(packages[0]));
      }
      
      setResult(packages);
    } catch (error) {
      console.error('Erro no teste de pacotes:', error);
      setResult(`ERRO: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetAllReviews = async () => {
    setLoading(true);
    try {
      console.log('=== TESTE: Chamando GetAllReviews ===');
      const response = await api.get('/Review/GetAllReviews');
      console.log('Resposta completa:', response);
      console.log('response.data:', response.data);
      console.log('Type of response.data:', typeof response.data);
      console.log('Is Array:', Array.isArray(response.data));
      
      if (response.data && response.data.length > 0) {
        console.log('Primeira review:', response.data[0]);
        console.log('Campos da primeira review:', Object.keys(response.data[0]));
      }
      
      setResult(response.data);
    } catch (error) {
      console.error('Erro no teste:', error);
      setResult(`ERRO: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetByPackageId = async (packageId = 1) => {
    setLoading(true);
    try {
      console.log(`=== TESTE: Chamando GetByPackageId/${packageId} ===`);
      const response = await api.get(`/Review/GetByPackageId/${packageId}`);
      console.log('Resposta completa:', response);
      console.log('response.data:', response.data);
      setResult(response.data);
    } catch (error) {
      console.error('Erro no teste GetByPackageId:', error);
      
      // Tentar fallback
      try {
        console.log('=== TESTE: Tentando fallback com GetAllReviews ===');
        const response = await api.get('/Review/GetAllReviews');
        const allReviews = response.data || [];
        const filtered = allReviews.filter(review => {
          const reviewPackageId = review.packageId || review.travelPackageId || review.pacoteId;
          return reviewPackageId === parseInt(packageId);
        });
        console.log('Reviews filtradas:', filtered);
        setResult(filtered);
      } catch (fallbackError) {
        console.error('Erro no fallback:', fallbackError);
        setResult(`ERRO: ${error.message} + Fallback: ${fallbackError.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Teste de API - Reservas, Pacotes e Reviews</h3>
      
      <div>
        <button onClick={testReservations} disabled={loading}>
          Testar Reservas
        </button>
        <button onClick={testPackages} disabled={loading} style={{ marginLeft: '10px' }}>
          Testar Pacotes
        </button>
        <button onClick={testGetAllReviews} disabled={loading} style={{ marginLeft: '10px' }}>
          Testar Reviews
        </button>
        <button onClick={() => testGetByPackageId(1)} disabled={loading} style={{ marginLeft: '10px' }}>
          Testar GetByPackageId (ID: 1)
        </button>
      </div>
      
      {loading && <p>Carregando...</p>}
      
      <div style={{ marginTop: '20px', maxHeight: '400px', overflow: 'auto' }}>
        <h4>Resultado:</h4>
        <pre style={{ background: '#f5f5f5', padding: '10px' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </div>
  );
}
