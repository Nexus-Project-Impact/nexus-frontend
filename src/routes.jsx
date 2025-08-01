import { Routes, Route } from 'react-router-dom';
// recursos de componente
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
// recursos de páginas de cliente
import Home from './pages/Home';
import LoginPage from './pages/login';
import PackagePage from './pages/PackagePage';
import PackageDetailPage from './pages/PackageDetailPage';
import ProfilePage from './pages/ProfilePage';
import ReservasPage from './pages/ReservasPage';
// recursos páginas de admin
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPackage from './pages/AdminPackage';

export default function AppRoutes(){
    return(
    <Routes>    
        <Route path='/' element={<Layout/>}>

            <Route index element={<PackagesPage/>}/>
                <Route path="pacotes" element={<PackagesPage />} />
                    <Route path="pacotes/:packageId" element={<PackageDetailPage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="reservas" element={<ReservasPage />} />
                            <Route path="perfil" element={<PerfilPage />} />

                                  {/*rotas protegidas*/}
            <PrivateRoute>
                <Route path="/admin/pacotes" element={<AdminPackageListPage />} />
                    <Route path="/admin/pacotes/novo" element={<AdminAddPackagePage />} />
                <Route path="/colaborador/login" element={<AdminLoginPage />} />
            </PrivateRoute>
        </Route>
    </Routes>
    );
}
