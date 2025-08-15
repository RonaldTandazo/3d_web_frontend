import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadignScreen from '@/custom/Templates/LoadingScreen';
import { useValidateUserAccess } from '@/services/Authentication/AuthenticationService';
import { useState } from 'react';
import { decodeFromBase64 } from './Helpers';

const OwnerRoute = () => {
    const { user, loading } = useAuth();
    const params = useParams();
    const { validateUserAccess, data: validateUserAccessData, loading: validateUserAccessLoading } = useValidateUserAccess();
    const [validationChecked, setValidationChecked] = useState(false);

    if (loading || validateUserAccessLoading) {
        return <LoadignScreen />
    }

    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    if (!validationChecked) {
        let module;
        let targetValue;
        
        if(params.username){
            module = 'ProfileSettings';
            targetValue = params.username;
        }

        if(params.artworkId){
            module = 'ArtWorkEdit'
            targetValue = decodeFromBase64(params.artworkId).toString()
        }

        if(module && targetValue){
            validateUserAccess(targetValue, module);
            setValidationChecked(true);
        }
    }

    if (validateUserAccessData && !validateUserAccessData.validateUserAccess.validate) {
        return <Navigate to="/NotFound" replace />;
    }

    return <Outlet />;
};

export default OwnerRoute;
