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
                    <Route path="/profile/:username" element={<Profile />} />
                    <Route path="/profileSettings/:username" element={<ProfileSettings />} />
                    {/*<Route path="/favorites" element={<Favorites />} />*/}
                </Route>
            </Route>

            {/* Ruta para login */}
            <Route element={<AuthLayout />}>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/loading" element={<LoadignScreen />} />
                <Route path="/NotFound" element={<NotFoundPage />} />
            </Route>

            <Route path="*" element={<RedirectToNotFound />} />
        </Routes>
    );
};

export default AppRoutes;
