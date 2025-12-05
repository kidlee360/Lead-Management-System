import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import cookie from 'cookie';

// GET /api/users -> returns currently authenticated user's profile (based on `user_id` cookie)
export async function GET(req: Request) {
  try {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const userId = cookies.user_id;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const result = await pool.query('SELECT id, user_name, email, role FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];
    return NextResponse.json({ id: user.id, username: user.user_name, email: user.email, role: user.role ?? null }, { status: 200 });
  } catch (error) {
    console.error('Users GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Disable the previous unsafe email-lookup POST. Keep explicit: method not allowed.
export async function POST() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
