// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import LoginPage from './pages/LoginUser';
import { PackagesPage } from './pages/PackagesPage';
import { PackageDetailPage } from './pages/PackageDetailPage'; 
//import {AddPackages} from './pages/AddPackages';
//import { AddReviewPage } from './pages/AddReview';
//import {CollaboratorMetrics} from './pages/CollaboratorPackages';
//import {CollaboratorRevervations} from './pages/CollaboratorRevervations';
//import {CollaboratorRevervationsView} from './pages/CollaboratorRevervationsViews';
//import {EditPackage} from './pages/EditPackage';
//import {LoginCollaborator} from './pages/LoginCollaborator';
//import {RecoverPassword} from './pages/RecoverPassword';

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