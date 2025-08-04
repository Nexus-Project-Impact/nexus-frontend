
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
        const response = await api.post('/TravelPackage/Create', travelPackage);
        return response.data;
    },

    updatePackage: async (id, travelPackage) =>{
        const response = await api.put(`/TravelPackage/Update/${id}`, travelPackage);
        return response.data;
    },
    
    deletePackage: async (id) => {
        const response = await api.delete(`/TravelPackage/Delete/${id}`);
        return response.data;
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