// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes';

function App() {
  return (

      <BrowserRouter>
        <AppRoutes />                     
      </BrowserRouter>
  );
}

export default App;