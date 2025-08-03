import { createSlice } from '@reduxjs/toolkit';

// Função para carregar estado inicial do localStorage
const loadInitialState = () => {
    try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
            const user = JSON.parse(userStr);
            return { user, token };
        }
    } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
    }
    
    return { user: null, token: null };
};

// ... seu código createSlice
const authSlice = createSlice({
    name: 'auth',
    initialState: loadInitialState(), // carrega dados do localStorage na inicialização
    reducers: {

        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },

});

// EXPORTE A NOVA AÇÃO
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;