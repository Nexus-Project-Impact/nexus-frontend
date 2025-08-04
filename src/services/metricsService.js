
import { api } from './api';

// Dados mock como fallback
const mockMetrics = {
  salesByDestination: [
    {
      destination: "Rio de Janeiro",
      quantity: 120
    },
    {
      destination: "Salvador", 
      quantity: 95
    },
    {
      destination: "Florianópolis",
      quantity: 80
    },
    {
      destination: "Nova York",
      quantity: 150
    },
    {
      destination: "Paris", 
      quantity: 1
    },
    {
      destination: "Roma",
      quantity: 2
    }
  ],
  salesByPeriod: [
    {
      date: "2025-07-01T00:00:00",
      quantity: 12
    },
    {
      date: "2025-07-02T00:00:00", 
      quantity: 15
    },
    {
      date: "2025-07-03T00:00:00",
      quantity: 19
    },
    {
      date: "2025-07-04T00:00:00",
      quantity: 25
    },
    {
      date: "2025-07-05T00:00:00",
      quantity: 30
    },
    {
      date: "2025-08-03T00:00:00",
      quantity: 4
    }
  ],
  salesByStatus: [
    {
      status: "Confirmado",
      quantity: 210
    },
    {
      status: "Pendente", 
      quantity: 65
    },
    {
      status: "Cancelado",
      quantity: 24
    }
  ],
  summary: {
    totalReservations: 299,
    totalClients: 85,
    topDestinations: [
      "Rio de Janeiro",
      "Salvador", 
      "Florianópolis"
    ]
  }
};

// Função para retornar métricas padrão em caso de erro
const getDefaultMetrics = () => {
  return mockMetrics;
};

// Função principal para buscar métricas
export const getMetricsData = async (dateFilter) => {
  try {
    console.log('Buscando métricas com filtro:', dateFilter);
    
    // Prepara os parâmetros para enviar à API
    const params = {};
    if (dateFilter?.startDate) {
      params.startDate = dateFilter.startDate;
    }
    if (dateFilter?.endDate) {
      params.endDate = dateFilter.endDate;
    }
    
    // Faz a requisição para a API
    const response = await api.get('/Dashboard/metrics', { params });
    console.log("Resposta da API:", response);
    
    // Retorna os dados da API com fallback para valores padrão
    return {
      salesByStatus: response.data.salesByStatus || [],
      salesByDestination: response.data.salesByDestination || [],
      salesByPeriod: response.data.salesByPeriod || [],
      summary: response.data.summary || {
        totalReservations: 0,
        totalClients: 0,
        topDestinations: []
      }
    };
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    
    // Em caso de erro, retorna os dados mock
    console.log('Usando dados mock como fallback');
    return getDefaultMetrics();
  }
};

// Função para exportar dados para Excel
export const exportToExcel = async (dateFilter = null) => {
  try {
    console.log('Exportando para Excel com filtro:', dateFilter);
    
    // Prepara os parâmetros para enviar à API
    const params = {};
    if (dateFilter?.startDate) {
      params.startDate = dateFilter.startDate;
    }
    if (dateFilter?.endDate) {
      params.endDate = dateFilter.endDate;
    }
    
    // Faz a requisição para exportar Excel
    const response = await api.get('/Dashboard/export-excel', { 
      params,
      responseType: 'blob' // Importante para downloads de arquivos
    });
    
    // Cria um link para download do arquivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `metricas_${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    console.log('Exportação para Excel concluída');
    return { success: true };
    
  } catch (error) {
    console.error('Erro ao exportar para Excel:', error);
    throw new Error('Falha ao exportar relatório Excel');
  }
};

// Função para exportar dados para PDF
export const exportToPDF = async (dateFilter = null) => {
  try {
    console.log('Exportando para PDF com filtro:', dateFilter);
    
    // Prepara os parâmetros para enviar à API
    const params = {};
    if (dateFilter?.startDate) {
      params.startDate = dateFilter.startDate;
    }
    if (dateFilter?.endDate) {
      params.endDate = dateFilter.endDate;
    }
    
    // Faz a requisição para exportar PDF
    const response = await api.get('/Dashboard/export-pdf', { 
      params,
      responseType: 'blob' // Importante para downloads de arquivos
    });
    
    // Cria um link para download do arquivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `metricas_${new Date().toISOString().split('T')[0]}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    console.log('Exportação para PDF concluída');
    return { success: true };
    
  } catch (error) {
    console.error('Erro ao exportar para PDF:', error);
    throw new Error('Falha ao exportar relatório PDF');
  }
};