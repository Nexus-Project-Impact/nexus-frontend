
import api from './api';


const packageService = {
    
    getPackages: async () => {
        const response = await api.get('/TravelPackage/GetAllPackages');
        return response.data;
    },

    getPackagesActive: async () => {
        const response = await api.get('/TravelPackage/GetAllActive');
        return response.data;
    },

    getPackageById: async (id) => {
        const response = await api.get(`/TravelPackage/GetById/${id}`);
        return response.data;
    } ,

    createPackage: async (travelPackage) =>{
        // Se for FormData (com imagem), usar headers multipart
        const config = travelPackage instanceof FormData ? {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        } : {};
        
        const response = await api.post('/TravelPackage/Create', travelPackage, config);
        return response.data;
    },

    updatePackage: async (id, travelPackage) =>{
        try {
            console.log('=== DEBUG UPDATE PACKAGE ===');
            console.log('ID:', id);
            console.log('Data type:', travelPackage instanceof FormData ? 'FormData' : 'Object');
            console.log('Data:', travelPackage);
            
            // Endpoint correto: PUT /TravelPackage/Update/{id}
            let response;
            
            if (travelPackage instanceof FormData) {
                // Se é FormData (com nova imagem), enviar como multipart
                console.log('Enviando como FormData (multipart/form-data)');
                response = await api.put(`/TravelPackage/Update/${id}`, travelPackage, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                // Se é objeto JSON (sem nova imagem), tentar diferentes abordagens
                console.log('Enviando como JSON');
                
                try {
                    // Primeira tentativa: JSON puro
                    response = await api.put(`/TravelPackage/Update/${id}`, travelPackage, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                } catch (jsonError) {
                    console.log('JSON falhou com status:', jsonError.response?.status);
                    
                    if (jsonError.response?.status === 415) {
                        // Se JSON falhou com 415, tentar converter para FormData
                        console.log('Convertendo JSON para FormData devido ao erro 415');
                        const formData = new FormData();
                        
                        // Adicionar cada campo ao FormData com a primeira letra maiúscula (padrão C#)
                        Object.keys(travelPackage).forEach(key => {
                            const value = travelPackage[key];
                            if (value !== null && value !== undefined) {
                                const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
                                formData.append(capitalizedKey, value);
                            }
                        });
                        
                        // Tentar novamente com FormData
                        response = await api.put(`/TravelPackage/Update/${id}`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                    } else {
                        throw jsonError;
                    }
                }
            }
            
            console.log('Update successful:', response.status);
            return response.data;
        } catch (error) {
            console.error('=== ERRO NO UPDATE ===');
            console.error('Error:', error);
            console.error('Status:', error.response?.status);
            console.error('Status Text:', error.response?.statusText);
            console.error('Response Data:', error.response?.data);
            console.error('Request Config:', error.config);
            throw error;
        }
    },
    
    deletePackage: async (id) => {
        try {
            console.log(`Excluindo pacote com ID: ${id}`);
            
            // Garantir que o ID é um número
            const numericId = parseInt(id);
            if (isNaN(numericId)) {
                throw new Error(`ID inválido: ${id}`);
            }
            
            // Usar o endpoint correto: DELETE /TravelPackage/Delete/{id}
            const response = await api.delete(`/TravelPackage/Delete/${numericId}`);
            
            console.log('Pacote excluído com sucesso:', response.status);
            return response.data;
        } catch (error) {
            console.error('Erro ao excluir pacote:', error);
            console.error('Status:', error.response?.status);
            console.error('Data:', error.response?.data);
            throw error;
        }
    },
    getByDepartureDate: async (initialDate, finalDate) => {
        const response = await api.get(`/TravelPackage/GetByDepartureDate/${initialDate}/${finalDate}`);
        return response.data;
    },
    getByDestination: async (destination) => {
        const response = await api.get(`/TravelPackage/GetByDestination/${destination}`);
        return response.data;
    },
    getByValue: async (minValue, maxValue) => {
        const response = await api.get(`/TravelPackage/GetByValue/${minValue}/${maxValue}`);
        return response.data;
    },

};


export default packageService;