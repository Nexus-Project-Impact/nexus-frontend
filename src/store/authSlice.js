import { createSlice } from '@reduxjs/toolkit';

// ... seu código createSlice
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
    },
    reducers: {

        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            localStorage.setItem('token', action.payload.token);
            localStorage.getItem('user', JSON.stringify(action.payload.user));
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('@app-token');
            localStorage.removeItem('@app-user');
        },
    },

});

// EXPORTE A NOVA AÇÃO
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;