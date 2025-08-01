import axios from 'axios';


const api = axios.create({
    baseURL: 'https://localhost:7164/', 
    headers: {
        'Content-Type' : 'application/json'
    }   
});

 
    api.interceptors.request.use(
       
        (config) => {
            const token = localStorage.getItem('token');
            if(token){
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },

        (error) => Promise.reject(error)
    );

//  exportar o recurso
export default api;