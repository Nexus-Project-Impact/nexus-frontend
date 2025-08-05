import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts e Componentes de Rota
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { PrivateRoute } from './components/PrivateRoute/index.jsx';

// Páginas
import { PackagesPage } from './pages/PackagesPage';
import { PackageDetailPage } from './pages/PackageDetailPage'; 
import LoginPage from './pages/LoginUser';
import AdminLoginPage from './pages/AdminLoginPage';
import  PerfilPage  from './pages/PerfilPage';
import {MinhasReservas} from './pages/MinhasReservas';
import { AdminPackage } from './pages/AdminPackage'
import AdminPackageList from './pages/AdminPackageList';
import {AdminEditPackage} from './pages/AdminEditPackage';
import { AdminReservation } from './pages/AdminReservation';
import { AdminReservationDetails } from './pages/AdminReservationDetails';
import AdminCommentModerationPage from './pages/AdminCommentModerationPage';
import AdminMetricsPage from './pages/AdminMetricsPage';
import AddReview from './pages/AddReview'

// Componentes temporários para páginas não implementadas
//function AdminMetrics() { return <h1>Métricas (a ser construída)</h1>; }

export default function AppRoutes(){
    return(
        <>
            <Routes>    
                {/* Rota pública standalone (sem layout principal) */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Rotas que usam o Layout principal do cliente */}
                <Route path='/' element={<Layout/>}>
                    {/* Rotas Públicas do Cliente */}
                    <Route index element={<PackagesPage/>}/>
                    <Route path="pacotes" element={<PackagesPage />} />
                    <Route path="pacotes/:packageId" element={<PackageDetailPage />} />
                    <Route path="login" element={<LoginPage />} />

                    {/* Rotas Protegidas do Cliente */}
                    <Route element={<PrivateRoute />}>
                        <Route path="reservas" element={<MinhasReservas />} />
                        <Route path="avaliar/:packageId" element={<AddReview />} />
                        <Route path="perfil" element={<PerfilPage />} />
                    </Route>
                </Route>

                {/* Rotas Protegidas do Admin (usando o AdminLayout) */}
                <Route element={<AdminLayout />}>
                    <Route path="/admin/pacotes" element={<AdminPackageList />} />
                    <Route path="/admin/pacotes/add" element={<AdminPackage />} />
                    <Route path="/admin/pacotes/editar/:id" element={<AdminEditPackage />} />
                    <Route path="/admin/reservas" element={<AdminReservation/>} />
                    <Route path="/admin/reservas/visualizar/:id" element={<AdminReservationDetails/>} />
                    <Route path="/admin/avaliacoes" element={<AdminCommentModerationPage />} />
                    <Route path="/admin/metricas" element={<AdminMetricsPage />} />
                </Route>
            </Routes>

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
        </>
    );
}

