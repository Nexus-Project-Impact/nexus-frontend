
const mockMetrics = {
  kpis: {
    soldPackages: 35,
    confirmedPayments: 23,
    pendingPayments: 7,
    totalRevenue: 127305.97,
  },
  salesByDestination: [
    { destination: 'Fernando de Noronha', percentage: 25.6 },
    { destination: 'Jericoacoara', percentage: 15.4 },
    { destination: 'Porto de Galinhas', percentage: 6.2 },
    { destination: 'Cancún', percentage: 18.8 },
    { destination: 'Punta Cana', percentage: 21.9 },
    { destination: 'Orlando', percentage: 12.1 },
  ],
  revenueByDestination: [
    { destination: 'Fernando de Noronha', revenue: 37488 },
    { destination: 'Jericoacoara', revenue: 18280 },
    { destination: 'Porto de Galinhas', revenue: 6392 },
    { destination: 'Cancún', revenue: 29856 },
    { destination: 'Punta Cana', revenue: 34202 },
    { destination: 'Orlando', revenue: 15944 },
  ],
};

export const getMetricsData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMetrics);
    }, 500); // Simula delay da rede
  });
};