import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export function SalesPieChart({ salesData }) {
  const data = {
    labels: salesData.map(d => d.destination),
    datasets: [{
      label: '% de Vendas',
      data: salesData.map(d => d.percentage),
      backgroundColor: [ '#ffb84d', '#ff9900','#D35400', '#8c52ff', '#6a0dad', '#E74C3C'],
      borderColor: '#fff',
      borderWidth: 2,
    }],
  };
  return <Pie data={data} />;
}