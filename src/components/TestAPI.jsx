import React, { useState, useEffect } from 'react';
import api from '../services/api';

export function TestAPI() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
      <h3>Teste de API - Reviews</h3>
      
      <div>
        <button onClick={testGetAllReviews} disabled={loading}>
          Testar GetAllReviews
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
