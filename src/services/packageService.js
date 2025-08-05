
import api from './api';


const packageService = {
    
    getPackages: async () => {
        const response = await api.get('/TravelPackage/GetAllPackages');
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
        // Se for FormData (com imagem), usar headers multipart
        const config = travelPackage instanceof FormData ? {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        } : {};
        
        const response = await api.put(`/TravelPackage/Update/${id}`, travelPackage, config);
        return response.data;
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
        const response = await api.get(`/TravelPackage/GetByDepartureDate/${initialDate, finalDate}`);
        return response.data;
    },
    getByDestination: async (destination) => {
        const response = await api.get(`/TravelPackage/GetByDestination/${destination}`);
        return response.data;
    },
    getByValue: async (minValue, maxValue) => {
        const response = await api.get(`/TravelPackage/GetByValue/${minValue, maxValue}`);
        return response.data;
    },

};


export default packageService;