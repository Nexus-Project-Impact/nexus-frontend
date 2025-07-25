import { createSlice } from '@reduxjs/toolkit';

// ... seu código createSlice
const authSlice = createSlice({
  name: 'auth',
  initialState: { /*...*/ },
  reducers: {
    // ADICIONE ESTA FUNÇÃO
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('@app-token');
      localStorage.removeItem('@app-user');
    },
  },
  extraReducers: (builder) => {
    // ... seu código extraReducers
  }
});

// EXPORTE A NOVA AÇÃO
export const { logout } = authSlice.actions;
export default authSlice.reducer;