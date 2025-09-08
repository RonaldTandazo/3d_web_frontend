import { useState, useEffect } from "react";

const useCustomTimer = (duration: number = 2000): boolean => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    return isLoading;
};

export default useCustomTimer;