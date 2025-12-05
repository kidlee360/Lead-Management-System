// pages/api/auth/login.ts

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined.');

// POST /api/auth/login (App Router)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, email, password } = body;
        const identifier = username || email;
        if (!identifier || !password) {
            return NextResponse.json({ error: 'Missing login credentials' }, { status: 400 });
        }
        const isEmailLogin = !!email;
        // DB column is user_name
        const result = await pool.query(
            `SELECT id, password, user_name, email, role FROM users WHERE ${isEmailLogin ? 'email' : 'user_name'} = $1`,
            [identifier]
        );
        const user = result.rows[0];
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
        // JWT payload includes role
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role ?? null,
        };
        const token = JWT_SECRET? jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' }) : null;
        // Set cookie
        const res = NextResponse.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.user_name,
                email: user.email,
                role: user.role ?? null,
            },
        }, { status: 200 });
        res.headers.set('Set-Cookie', `user_id=${user.id}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`);
        return res;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 });
    }
}