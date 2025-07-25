// DENTRO DE: src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// Use "export const" em vez de "export default"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // ... outros reducers aqui
  },
});