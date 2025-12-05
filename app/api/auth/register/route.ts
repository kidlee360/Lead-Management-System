import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined. Registration route will fail.');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Support both `username` and `firstName` from the client
    const username = body.username ?? body.firstName;
    const email = body.email;
    const password = body.password;

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'username, email and password are required' }, { status: 400 });
    }

    // Check if user exists (DB uses `user_name` column)
    const cUser = await pool.query('SELECT id, email FROM users WHERE user_name = $1 OR email = $2', [username, email]);
    if (cUser.rows.length > 0) {
      return NextResponse.json({ error: 'User with this username or email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3) RETURNING id, user_name, email, role',
      [username, email, hashedPassword]
    );

    const user = result.rows[0];
    const tokenPayload = { userId: user.id, email: user.email, role: user.role ?? null };
    const token = JWT_SECRET ? jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' }) : null;

    const res = NextResponse.json({ message: 'User created successfully', token, user: { id: user.id, username: user.user_name, email: user.email, role: user.role ?? null } }, { status: 201 });

    // Set a cookie with the user id (optional)
    res.headers.set('Set-Cookie', `user_id=${user.id}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`);

    return res;
  } catch (err) {
    console.error('Registration error (route.ts):', err);
    return NextResponse.json({ error: 'Internal server error during registration' }, { status: 500 });
  }
}
