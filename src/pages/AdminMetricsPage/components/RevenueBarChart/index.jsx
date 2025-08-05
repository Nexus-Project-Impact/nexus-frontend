import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function RevenueBarChart({ salesDestinationData }) {
  const options = { 
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };
  
  const data = {
    labels: salesDestinationData.map(d => d.destination),
    datasets: [{
      label: 'Quantidade',
      data: salesDestinationData.map(d => d.quantity),
      backgroundColor: '#4472C4',
    }],
  };
  return <Bar options={options} data={data} />;
}