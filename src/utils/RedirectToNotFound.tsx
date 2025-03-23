import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectToNotFound = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/NotFound", { replace: true });
    }, [navigate]);

    return null;
};

export default RedirectToNotFound;
