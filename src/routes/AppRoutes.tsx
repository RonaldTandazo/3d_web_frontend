import { Routes, Route } from 'react-router-dom';
import ArtVerse from '@/pages/Home/ArtVerse';
import Model from '@/pages/Models/Model';
import SignIn from '@/pages/Authentication/SignIn';
import SignUp from '@/pages/Authentication/SignUp';
//import Profile from './pages/User/Profile';
//import Favorites from './pages/User/Favorites';
import PrivateRoute from '../utils/PrivateRoute';
import MainLayout from '@/pages/Layouts/MainLayout';
import AuthLayout from '@/pages/Layouts/AuthLayout';
import LoadignScreen from '@/custom/components/LoadingScreen';
import NotFoundPage from '@/pages/Layouts/NotFound';
import RedirectToNotFound from '@/utils/RedirectToNotFound';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<ArtVerse />} />
                <Route path="/product/:id" element={<Model />} />
            </Route>

            {/* Rutas protegidas */}
            {/*<Route element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/favorites" element={<Favorites />} />
            </Route>*/}

            {/* Ruta para login */}
            <Route element={<AuthLayout />}>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/loading" element={<LoadignScreen />} />
            </Route>

            <Route path="*" element={<RedirectToNotFound />} />

            <Route element={<AuthLayout />}>
                <Route path="/NotFound" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
