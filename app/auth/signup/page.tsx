// client/app/auth/signup/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // For redirecting after success
import useAuth from '../../../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';


const SignupPage = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({ firstName: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post(`/api/auth/register`, formData);
            
            const decodedToken = jwtDecode(response.data.token);
            const expiryTimeMs = decodedToken.exp! * 1000; // Convert seconds (JWT 'exp') to milliseconds
            // Success: Store token (Best practice is to use cookies/session storage for JWT)
           // 2. Store the token and the expiry time together
           localStorage.setItem('authData', JSON.stringify({
              token: response.data.token,
              expiry: expiryTimeMs
            }));
            
            setMessage('Registration successful! Redirecting to dashboard...');
            
            // Redirect to the main dashboard page
            router.push('/'); 

        } catch (err: any) {
            // Handle validation errors (400) or general errors (500)
            const errMsg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed. Try again.';
            setError(errMsg);
        }
    };

    useEffect(() => {
            if (!isLoading && isAuthenticated) {
                // User IS logged in, redirect them to the dashboard
                router.push('/');
            }
        }, [isAuthenticated, isLoading, router]);
    
        if (isLoading || isAuthenticated) {
            // Hide the form while checking state or if user is logged in
            return <div>Redirecting...</div>;
        }

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Register</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p style={{ textAlign: 'center', marginTop: '15px' }}>
                Already have an account? <a href="/auth/login">Login</a>
            </p>
        </div>
    );
};

export default SignupPage;