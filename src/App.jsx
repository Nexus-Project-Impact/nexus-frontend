// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './components/ErrorFallback';
import { Layout } from './components/Layout';
import LoginPage from './pages/LoginUser';
import { PackagesPage } from './pages/PackagesPage';
import { PackageDetailPage } from './pages/PackageDetailPage'; 


function HomePage() { return <h1>Página Inicial</h1>; }
function PacotesPage() { return <h1>Página de Pacotes</h1>; }
import PerfilPage from './pages/PerfilPage';
import { MinhasReservas } from './pages/MinhasReservas';
import { AddReviewPage } from './pages/AddReview';

function App() {
  return (

    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo);
        // Aqui você pode enviar o erro para um serviço de monitoramento
        // como Sentry, LogRocket, etc.
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<PackagesPage />} />
            <Route path="pacotes" element={<PackagesPage />} />
            <Route path="pacotes/:packageId" element={<PackageDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            {/* ✅ NOVAS ROTAS */}
            <Route path="reservas" element={<MinhasReservas />} />
            <Route path="avaliar/:packageId" element={<AddReviewPage />} />
            <Route path="perfil" element={<PerfilPage />} />
          </Route>
        </Routes>

        {/* Rotas Protegidas do Admin (usando o AdminLayout) */}
        {/*<Route element={<PrivateRoute />}>*/}
        <Route element={<AdminLayout />}>
            <Route path="/admin/pacotes" element={<AdminPackageList />} />
            <Route path="/admin/pacotes/add" element={<AdminPackage />} />
            <Route path="/admin/pacotes/editar/:id" element={<AdminEditPackage />} />
            <Route path="/admin/reservas" element={<AdminReservation/>} />
            <Route path="/admin/reservas/visualizar/:id" element={<AdminReservationDetails/>} />
            <Route path="/admin/comentarios" element={<AdminCommentModerationPage />} />
            <Route path="/admin/metricas" element={<AdminMetricsPage />} />
            {/* Outras rotas de admin viriam aqui */}
        {/* </Route>*/}
        </Route>

                     
         {/* Container para as notificações */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
                     
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;