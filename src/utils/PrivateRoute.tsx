import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/signin" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
