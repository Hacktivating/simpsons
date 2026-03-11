import { useAuth } from '@clerk/react'
import { useEffect } from 'react'
import api from "../lib/axios" // Ensure this path matches your structure

function useAuthReq() {
    const { isSignedIn, getToken, isLoaded } = useAuth();

    useEffect(() => {
        const interceptor = api.interceptors.request.use(async (config) => {
            if (isSignedIn) {
                // REQUIRED FIX: Added await here
                const token = await getToken(); 
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            return config;
        });
        return () => api.interceptors.request.eject(interceptor);
    }, [isSignedIn, getToken]);

    return { isSignedIn, isClerkLoaded: isLoaded };
}

export default useAuthReq;