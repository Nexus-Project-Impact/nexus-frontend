import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function SalesLineChart({ salesPeriodData }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const data = {
    labels: salesPeriodData.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('pt-BR');
    }),
    datasets: [
      {
        label: 'Quantidade',
        data: salesPeriodData.map(d => d.quantity),
        borderColor: '#ff9900',
        backgroundColor: '#ff9900',
        tension: 0.4,
      },
    ],
  };

  return <Line options={options} data={data} />;
}
