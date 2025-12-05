// client/hooks/useAuth.ts (Create this file)

import { useState, useEffect } from 'react';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
    setIsLoading(true);
    const storedAuthData = localStorage.getItem('authData'); 

    // 1. CHECK FOR EXISTENCE: Only proceed if the string is NOT null/undefined
    if (storedAuthData) { 
        let authData: { token: string, expiry: number } | null = null;
        
        try {
            // 2. SAFE PARSING: Use a try/catch block in case the JSON is corrupted
            authData = JSON.parse(storedAuthData);
        } catch (e) {
            console.error("Auth Data Corrupted, Clearing localStorage:", e);
            localStorage.removeItem('authData');
            setIsAuthenticated(false);
            setIsLoading(false);
            return; // Stop execution here
        }
        
        // 3. NULL CHECK: Check if parsing failed or if the essential properties exist
        if (authData && authData.token && authData.expiry) {
            const currentTime = Date.now();

            if (currentTime > authData.expiry) {
                // Token has EXPIRED
                localStorage.removeItem('authData');
                setIsAuthenticated(false);
            } else {
                // Token is VALID
                setIsAuthenticated(true);
            }
        } else {
            // Data was incomplete, treat as unauthenticated
            localStorage.removeItem('authData');
            setIsAuthenticated(false);
        }
    }
    
       
    setIsLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem('authData');
        setIsAuthenticated(false);
    };

    return { isAuthenticated, isLoading, logout };
};

export default useAuth;