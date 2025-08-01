// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts e Componentes de Rota
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { PrivateRoute } from './components/PrivateRoute';

// Páginas
import { PackagesPage } from './pages/PackagesPage';
import { PackageDetailPage } from './pages/PackageDetailPage'; 
import LoginPage from './pages/login';
import AdminLoginPage from './pages/AdminLoginPage';
import { ProfilePage } from './pages/ProfilePage';
import ReservasPage from './pages/ReservasPage';
//import { AdminPackage } from './pages/AdminPackage';
import { AdminPackage } from './pages/AdminPackage'
import AdminPackageList from './pages/AdminPackageList';
import {AdminEditPackage} from './pages/AdminEditPackage';

//function AdminEditPackage() { return <h1>Edit Pacote (a ser construída)</h1>; }
function AdminReservation() { return <h1>Reservas (a ser construída)</h1>; }
function AdminMetrics() { return <h1>Métricas (a ser construída)</h1>; }
function AdminComents() { return <h1>Comentários (a ser construída)</h1>; }

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública standalone (sem layout principal) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Rotas que usam o Layout principal do cliente */}
        <Route path="/" element={<Layout />}>
          {/* Rotas Públicas do Cliente */}
          <Route index element={<PackagesPage />} />
          <Route path="pacotes" element={<PackagesPage />} />
          <Route path="pacotes/:packageId" element={<PackageDetailPage />} />
          <Route path="login" element={<LoginPage />} />

          {/* Rotas Protegidas do Cliente */}
          <Route element={<PrivateRoute />}>
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="reservas" element={<ReservasPage />} />
          </Route>
        </Route>
        
        {/* Rotas Protegidas do Admin (usando o AdminLayout) */}
        {/*<Route element={<PrivateRoute />}>*/}
          <Route element={<AdminLayout />}>
            <Route path="/admin/pacotes" element={<AdminPackageList />} />
            <Route path="/admin/pacotes/add" element={<AdminPackage />} />
            <Route path="/admin/pacotes/editar/:id" element={<AdminEditPackage />} />
            <Route path="/admin/reservas" element={<AdminReservation/>} />
            <Route path="/admin/metricas" element={<AdminMetrics/>} />
            <Route path="/admin/comentarios" element={<AdminComents />} />
            {/* Outras rotas de admin viriam aqui */}
         {/* </Route>*/}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;