import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export function SalesPieChart({ salesStatusData }) {
  const totalQuantity = salesStatusData.reduce((sum, item) => sum + item.quantity, 0);
  
  const data = {
    labels: salesStatusData.map(d => d.status),
    datasets: [{
      label: 'Quantidade',
      data: salesStatusData.map(d => d.quantity),
      backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
      borderColor: '#fff',
      borderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const percentage = ((context.parsed / totalQuantity) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  return <Pie data={data} options={options} />;
}