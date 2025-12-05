// lib/validation.ts (UPDATED)

import { body, validationResult, ValidationChain } from 'express-validator';
import { NextApiRequest, NextApiResponse } from 'next';

export const validate = (validations: ValidationChain[]) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Run all validations sequentially
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return; 
    }

    // Return 400 Bad Request if validation fails
    return res.status(400).json({ 
        errors: errors.array({ onlyFirstError: true })
    });
  };
};

// Validation chain for the user registration endpoint (using username)
export const registrationValidation: ValidationChain[] = [
    // Email Validation
    body('email')
        .isEmail().withMessage('Email must be a valid format (e.g., user@domain.com)')
        .normalizeEmail(),

    // Password Validation
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
        .withMessage('Password must include one uppercase letter, one number, and one symbol.'),
    
    // Username Validation
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
];

// Validation chain for user login
export const loginValidation: ValidationChain[] = [
    // This assumes the client might send email OR username for login
    // Note: The logic inside your handler uses `username` OR `email`, 
    // but a simpler validation usually checks if *either* field is present and valid. 
    // Given your handler's current structure, we'll validate the two fields you check for existence:
    body('username').optional().trim().notEmpty().withMessage('Username or Email is required.'),
    body('email').optional().isEmail().withMessage('Invalid email format.'),
    body('password').notEmpty().withMessage('Password is required.'),
];