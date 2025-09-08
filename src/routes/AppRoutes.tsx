import { Routes, Route } from 'react-router-dom';
import ArtVerse from '@/screens/Home/ArtVerse';
import ArtworkView from '@/screens/Artwork/ArtworkView';
import SignIn from '@/screens/Authentication/SignIn';
import SignUp from '@/screens/Authentication/SignUp';
//import Favorites from './pages/User/Favorites';
import PrivateRoute from '../utils/PrivateRoute';
import MainLayout from '@/screens/Layouts/MainLayout';
import AuthLayout from '@/screens/Layouts/AuthLayout';
import LoadingScreen from '@/custom/Templates/LoadingScreen';
import NotFoundPage from '@/screens/Layouts/NotFound';
import RedirectToNotFound from '@/utils/RedirectToNotFound';
import Profile from '@/screens/User/Profile';
import ProfileSettings from '@/screens/User/ProfileSettings';
import ArtworkStore from '@/screens/Artwork/NewArtwork';
import ArtworkEdit from '@/screens/Artwork/ArtworkEdit';
import Viewer from '@/screens/Artwork/Viewer';
import OwnerRoute from '@/utils/OwnerRoute';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<ArtVerse />} />
                <Route path="/Artworks/:title/:artworkId/View" element={<ArtworkView />} />
                <Route path="/Viewer" element={<Viewer/>}></Route>
            </Route>

            {/* Rutas protegidas */}
            <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/Profile/:username" element={<Profile />} />
                    <Route path="/Artworks/New" element={<ArtworkStore />} />
                    {/*<Route path="/favorites" element={<Favorites />} />*/}
                </Route>
            </Route>

            <Route element={<OwnerRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/ProfileSettings/:username" element={<ProfileSettings />} />
                    <Route path="/Artworks/:title/:artworkId/Edit" element={<ArtworkEdit />} />
                </Route>
            </Route>

            {/* Ruta para login */}
            <Route element={<AuthLayout />}>
                <Route path="/SignIn" element={<SignIn />} />
                <Route path="/SignUp" element={<SignUp />} />
            </Route>

            <Route path="/Loading" element={<LoadingScreen />} />
            <Route path="/NotFound" element={<NotFoundPage />} />
            <Route path="*" element={<RedirectToNotFound />} />
        </Routes>
    );
};

export default AppRoutes;
