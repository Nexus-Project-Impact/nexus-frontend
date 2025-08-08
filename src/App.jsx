// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './contexts/ThemeContext';
import AppRoutes from './routes';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />                     
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;