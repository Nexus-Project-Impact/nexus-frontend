// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import LoginPage from './pages/login';
import { PackagesPage } from './pages/PackagesPage';
import { PackageDetailPage } from './pages/PackageDetailPage'; 

// (Opcional) Crie um componente para a página inicial para ter uma rota de exemplo.
function HomePage() { return <h1>Página Inicial</h1>; }
function PacotesPage() { return <h1>Página de Pacotes</h1>; }

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PackagesPage />} />
          <Route path="pacotes" element={<PackagesPage />} />
          {/* 2. Adicione a rota dinâmica aqui */}
          <Route path="pacotes/:packageId" element={<PackageDetailPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;