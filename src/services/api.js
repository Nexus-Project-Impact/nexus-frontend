// Axios é usada para fazer requisições HTTP (get, post, ect)
import axios from 'axios';

// 1º passo: definir a URL/ENDPOIN base para integração com o backend
export const api = axios.create({
  baseURL: 'http://localhost:5235/' || 'https://localhost:7164/', // Coloque aqui a porta do seu backend

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

// Interceptor para responses - captura erros globalmente
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error intercepted:', error);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      
      // Se há erros de validação, log detalhado
      if (error.response.data?.errors) {
        console.error('Validation errors:', error.response.data.errors);
      }
    }
    
    return Promise.reject(error);
  }
);

// 3° passo
export default api;
