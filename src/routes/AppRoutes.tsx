import { Routes, Route } from 'react-router-dom';
import ArtVerse from '@/pages/Home/ArtVerse';
import ArtEspecifications from '@/pages/Models/ArtEspecifications';
import SignIn from '@/pages/Authentication/SignIn';
import SignUp from '@/pages/Authentication/SignUp';
//import Favorites from './pages/User/Favorites';
import PrivateRoute from '../utils/PrivateRoute';
import MainLayout from '@/pages/Layouts/MainLayout';
import AuthLayout from '@/pages/Layouts/AuthLayout';
import LoadignScreen from '@/custom/Templates/LoadingScreen';
import NotFoundPage from '@/pages/Layouts/NotFound';
import RedirectToNotFound from '@/utils/RedirectToNotFound';
import Profile from '@/pages/User/Profile';
import ProfileSettings from '@/pages/User/ProfileSettings';
import ArtStore from '@/pages/Models/ArtStore';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<ArtVerse />} />
                <Route path="/specifications/:id" element={<ArtEspecifications />} />
            </Route>

            {/* Rutas protegidas */}
            <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/Profile/:username" element={<Profile />} />
                    <Route path="/ProfileSettings/:username" element={<ProfileSettings />} />
                    <Route path="/NewArt" element={<ArtStore />} />
                    {/*<Route path="/favorites" element={<Favorites />} />*/}
                </Route>
            </Route>

            {/* Ruta para login */}
            <Route element={<AuthLayout />}>
                <Route path="/SignIn" element={<SignIn />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/Loading" element={<LoadignScreen />} />
                <Route path="/NotFound" element={<NotFoundPage />} />
            </Route>

            <Route path="*" element={<RedirectToNotFound />} />
        </Routes>
    );
};

export default AppRoutes;
