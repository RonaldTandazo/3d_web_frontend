import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadignScreen from '@/custom/Templates/LoadingScreen';

const PrivateRoute = () => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <LoadignScreen />
    }

    if (!user) {
        return <Navigate to="/signin" replace/>;
    }

    return <Outlet />;
};

export default PrivateRoute;
