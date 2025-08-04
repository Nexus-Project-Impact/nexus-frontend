import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function RevenueBarChart({ revenueData }) {
  const options = { responsive: true, plugins: { legend: { display: false } } };
  const data = {
    labels: revenueData.map(d => d.destination),
    datasets: [{
      label: 'Receita (R$)',
      data: revenueData.map(d => d.revenue),
      backgroundColor: '#ff9900',
    }],
  };
  return <Bar options={options} data={data} />;
}