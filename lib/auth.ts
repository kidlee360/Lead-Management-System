// lib/auth.ts

import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// Extend the Request object type for Next.js to include the user's ID
// This is necessary so the handler can access req.userId
export interface AuthenticatedNextApiRequest extends NextApiRequest {
    userId?: string; // Changed to string to match typical UUID or large integer IDs
}

const JWT_SECRET = process.env.JWT_SECRET;

// Ensure JWT_SECRET is available at runtime
if (!JWT_SECRET) {
    // In a real application, crash the process if the secret is missing
    console.error("FATAL ERROR: JWT_SECRET is not defined. Please check your .env file.");
    // In a local environment, process.exit(1) is safer. For this sandbox, we just log.
}

/**
 * Higher-Order Function (HOF) to protect Next.js API Routes.
 * It checks for a valid Bearer Token in the Authorization header.
 * * @param handler The original Next.js API handler function to protect.
 * @returns A new handler function that performs authentication first.
 */
export const withAuth = (handler: (req: AuthenticatedNextApiRequest, res: NextApiResponse) => Promise<void>) => {
    return async (req: AuthenticatedNextApiRequest, res: NextApiResponse) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization token required.' });
        }

        // Extract the token (e.g., "Bearer YOUR_TOKEN" -> "YOUR_TOKEN")
        const token = authHeader.split(' ')[1];

        try {
            // Verify token and decode payload
            // Assuming your JWT payload is { userId: string | number, email: string }
            const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string, email: string };
            
            // Attach the user's ID to the request object
            req.userId = decoded.userId;

            // Proceed to the original handler logic if verification succeeds
            return handler(req, res); 
        } catch (error) {
            console.error('Token verification failed:', error);
            // If verification fails (e.g., token expired, invalid signature)
            return res.status(401).json({ error: 'Invalid or expired token.' });
        }
    };
};