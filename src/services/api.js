// Axios é usada para fazer requisições HTTP (get, post, ect)
import axios from 'axios';

// 1º passo: definir a URL/ENDPOIN base para integração com o backend
export const api = axios.create({
  baseURL: 'https://localhost:7164', // Coloque aqui a porta do seu backend

  headers: {
        'Content-Type' : 'application/json'
    }

});

// 2° passo: precisamos definir um interceptor para que o token JWT seja obtido
api.interceptors.request.use(
        // callback para interceptar o token
        (config) => {
            const token = localStorage.getItem('token');
            if(token){
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },

        (error) => Promise.reject(error)
);

// Interceptor de resposta para capturar erros
api.interceptors.response.use(
    (response) => {
        console.log('✅ Resposta da API:', response.config.url, response.status);
        return response;
    },
    (error) => {
        console.error('❌ Erro na resposta da API:', error.config?.url, error.response?.status);
        console.error('Detalhes do erro:', error.response?.data);
        
        // Se erro 401, token pode ter expirado
        if (error.response?.status === 401) {
            console.warn('🔐 Token possivelmente expirado - erro 401');
            // Opcional: remover token inválido
            // localStorage.removeItem('token');
            // localStorage.removeItem('user');
        }
        
        return Promise.reject(error);
    }
);

// 3° passo
export default api;
