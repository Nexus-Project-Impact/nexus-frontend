
import { api } from './api';

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
    
    // Retorna os dados da API
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
    throw error; // Propaga o erro em vez de retornar dados mock
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