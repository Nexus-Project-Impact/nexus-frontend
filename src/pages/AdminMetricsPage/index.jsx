import React, { useState, useEffect } from 'react';
import {getMetricsData} from '../../services/metricsService';
import { StatCard } from './components/StatCard';
import { SalesPieChart } from './components/SalesPieChart';
import { RevenueBarChart } from './components/RevenueBarChart';
import styles from './AdminMetricsPage.module.css';

export default function AdminMetricsPage() {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    metricsService.getMetricsData().then(data => {
      setMetrics(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <p>Carregando métricas...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Métricas</h1>
        {/* DatePicker pode ser adicionado aqui depois */}
      </div>
      
      <div className={styles.kpiGrid}>
        <StatCard title="Pacotes vendidos" value={metrics.kpis.soldPackages} />
        <StatCard title="Pagamentos confirmados" value={metrics.kpis.confirmedPayments} />
        <StatCard title="Pagamentos Pendentes" value={metrics.kpis.pendingPayments} />
        <StatCard title="Receita Total" value={metrics.kpis.totalRevenue} isCurrency />
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartContainer}>
          <h3>Participação nas Vendas por Destino</h3>
          <SalesPieChart salesData={metrics.salesByDestination} />
        </div>
        <div className={styles.chartContainer}>
          <h3>Receita por Destino (Vendas x Preço Médio)</h3>
          <RevenueBarChart revenueData={metrics.revenueByDestination} />
        </div>
      </div>

      <div className={styles.actions}>
        <button>Exportar Relatórios</button>
        <button>Exportar Pdf</button>
      </div>
    </div>
  );
}