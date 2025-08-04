import React, { useState, useEffect } from 'react';
import { getMetricsData, exportToExcel, exportToPDF } from '../../services/metricsService';
import { StatCard } from './components/StatCard';
import { SalesPieChart } from './components/SalesPieChart';
import { RevenueBarChart } from './components/RevenueBarChart';
import { SalesLineChart } from './components/SalesLineChart';
import { DateFilter } from './components/DateFilter';
import { Toast } from './components/Toast';
import styles from './AdminMetricsPage.module.css';

export default function AdminMetricsPage() {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDateFilter, setCurrentDateFilter] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async (dateFilter = null) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentDateFilter(dateFilter);
      const data = await getMetricsData(dateFilter);
      setMetrics(data);
    } catch (err) {
      console.error('Erro ao carregar métricas:', err);
      setError('Erro ao carregar métricas. Dados mock sendo exibidos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (dateFilter) => {
    loadMetrics(dateFilter);
  };

  const handleDateError = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const closeToast = () => {
    setShowToast(false);
    setToastMessage('');
  };

  const handleExportExcel = async () => {
    try {
      setError(null);
      await exportToExcel(currentDateFilter);
    } catch (err) {
      console.error('Erro ao exportar Excel:', err);
      setError('Erro ao exportar relatório Excel. Tente novamente.');
    }
  };

  const handleExportPDF = async () => {
    try {
      setError(null);
      await exportToPDF(currentDateFilter);
    } catch (err) {
      console.error('Erro ao exportar PDF:', err);
      setError('Erro ao exportar relatório PDF. Tente novamente.');
    }
  };

  const exportButtons = (
    <>
      <button onClick={handleExportExcel} className="exportButton">
        Exportar Excel
      </button>
      <button onClick={handleExportPDF} className="exportButton">
        Exportar PDF
      </button>
    </>
  );

  if (isLoading) return <div className={styles.loading}>Carregando métricas...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Métricas</h1>
      </div>
      
      {error && (
        <div className={styles.errorBanner}>
          {error}
        </div>
      )}
      
      <DateFilter 
        onDateChange={handleDateChange} 
        onError={handleDateError}
        exportActions={exportButtons} 
      />
      
      <div className={styles.kpiGrid}>
        <StatCard title="Total de Reservas" value={metrics.summary.totalReservations} />
        <StatCard title="Total de Clientes" value={metrics.summary.totalClients} />
        <StatCard title="Top Destino" value={metrics.summary.topDestinations[0]} />
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartContainer}>
          <h3>Vendas por Destino</h3>
          <div>
            <RevenueBarChart salesDestinationData={metrics.salesByDestination} />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h3>Vendas por Status</h3>
          <div>
            <SalesPieChart salesStatusData={metrics.salesByStatus} />
          </div>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.chartContainer}>
          <h3>Vendas por Período</h3>
          <div>
            <SalesLineChart salesPeriodData={metrics.salesByPeriod} />
          </div>
        </div>
        
        <div className={styles.summaryCard}>
          <h4>Resumo Geral (KPI)</h4>
          <ul>
            <li>Total de Reservas: {metrics.summary.totalReservations}</li>
            <li>Total de Clientes: {metrics.summary.totalClients}</li>
            <li>Top Destinos: {metrics.summary.topDestinations.join(', ')}</li>
          </ul>
        </div>
      </div>
      
      <Toast 
        message={toastMessage}
        isVisible={showToast}
        onClose={closeToast}
        type="error"
      />
    </div>
  );
}