// Exemplo de como seu arquivo `src/store/store.js` deve se parecer

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Importando o reducer do seu slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // ...seus outros reducers virão aqui
  },
});