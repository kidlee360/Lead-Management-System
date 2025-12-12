// client/hooks/useAuth.ts

import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthData {
  token: string;
  expiry: number;
}

interface DecodedToken {
  userId: number;
  email: string;
  role: string | null;
  iat?: number;
  exp?: number;
}

export default function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [role, setRole] = useState<string | null>(null);
    
    useEffect(() => {
    setIsLoading(true);
    const storedAuthData = localStorage.getItem('authData'); 

    // 1. CHECK FOR EXISTENCE: Only proceed if the string is NOT null/undefined
    if (storedAuthData) { 
        let authData: AuthData | null = null;
        
        try {
            // 2. SAFE PARSING: Use a try/catch block in case the JSON is corrupted
            authData = JSON.parse(storedAuthData);
        } catch (e) {
            console.error("Auth Data Corrupted, Clearing localStorage:", e);
            localStorage.removeItem('authData');
            setIsAuthenticated(false);
            setRole(null);
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
                setRole(null);
            } else {
                // Token is VALID - decode to extract role
                try {
                  const decoded = jwtDecode<DecodedToken>(authData.token);
                  setIsAuthenticated(true);
                  setRole(decoded.role ?? null);
                } catch (decodeErr) {
                  console.error('Failed to decode JWT:', decodeErr);
                  localStorage.removeItem('authData');
                  setIsAuthenticated(false);
                  setRole(null);
                }
            }
        } else {
            // Data was incomplete, treat as unauthenticated
            localStorage.removeItem('authData');
            setIsAuthenticated(false);
            setRole(null);
        }
    }
    
       
    setIsLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem('authData');
        setIsAuthenticated(false);
        setRole(null);
    };

    return { isAuthenticated, isLoading, logout, role };
};