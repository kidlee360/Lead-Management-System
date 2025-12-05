import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import cookie from 'cookie';

// GET /api/users/admin -> returns all users if requester is admin
export async function GET(req: Request) {
  try {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const userId = cookies.user_id;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    // Get requesting user's role
    const userRes = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0 || userRes.rows[0].role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }
    // Return all users
    const result = await pool.query('SELECT id, user_name, email, role FROM users ORDER BY id ASC');
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Admin users GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
