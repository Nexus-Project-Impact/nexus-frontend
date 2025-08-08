import api from "./api";

// Versões alternativas para testar diferentes configurações

const AccountService = {
    // Versão original (GET)
    getAccountData: async () => {
        try {
            console.log('🔄 Tentando GET /User/getUserData');
            const response = await api.get('/User/getUserData');
            return response.data;
        } catch (error) {
            console.log('❌ GET falhou, tentando alternativas...');
            throw error;
        }
    },

    // Alternativa 1: POST em vez de GET
    getAccountDataPost: async () => {
        try {
            console.log('🔄 Tentando POST /User/getUserData');
            const response = await api.post('/User/getUserData');
            return response.data;
        } catch (error) {
            console.log('❌ POST falhou');
            throw error;
        }
    },

    // Alternativa 2: Endpoint diferente
    getAccountDataAlt: async () => {
        try {
            console.log('🔄 Tentando GET /User/getAccountData');
            const response = await api.get('/User/getAccountData');
            return response.data;
        } catch (error) {
            console.log('❌ Endpoint alternativo falhou');
            throw error;
        }
    },

    // Alternativa 3: Endpoint de perfil
    getProfile: async () => {
        try {
            console.log('🔄 Tentando GET /User/profile');
            const response = await api.get('/User/profile');
            return response.data;
        } catch (error) {
            console.log('❌ Profile endpoint falhou');
            throw error;
        }
    },

    // Função que tenta todas as alternativas
    getAccountDataWithFallback: async () => {
        const alternatives = [
            { name: 'GET /User/getUserData', fn: () => api.get('/User/getUserData') },
            { name: 'POST /User/getUserData', fn: () => api.post('/User/getUserData') },
            { name: 'GET /User/getAccountData', fn: () => api.get('/User/getAccountData') },
            { name: 'GET /User/profile', fn: () => api.get('/User/profile') },
            { name: 'GET /api/User/getUserData', fn: () => api.get('/api/User/getUserData') },
        ];

        for (const alt of alternatives) {
            try {
                console.log(`🔄 Tentando: ${alt.name}`);
                const response = await alt.fn();
                console.log(`✅ Sucesso com: ${alt.name}`, response.data);
                return response.data;
            } catch (error) {
                console.log(`❌ Falhou: ${alt.name}`, error.response?.status);
                // Continue para a próxima alternativa
            }
        }

        // Se chegou aqui, todas as alternativas falharam
        throw new Error('Todos os endpoints testados falharam');
    }
};

export default AccountService;
