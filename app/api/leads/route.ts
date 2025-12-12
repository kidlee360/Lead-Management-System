import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import cookie from 'cookie';

export async function GET(req: Request) {
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  try {
    const userId = cookies.user_id;
    const result = await pool.query(
      'SELECT * FROM leads WHERE user_id = $1 ORDER BY id ASC',
      [userId]
    );
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  try {
    const body = await req.json();
    // Accept either snake_case or camelCase from the client
    const {
      client_name,
      deal_description,
      deal_value,
      last_activity_at,
      lead_source,
      time_in_stage,
      column_name,
      columnName,
    } = body;
    const column_name_final = column_name ?? columnName;

    // Normalize date-like values: empty string or invalid dates -> null
    const parseDateOrNull = (v: any) => {
      if (v === null || v === undefined) return null;
      if (typeof v === 'string' && v.trim() === '') return null;
      const t = Date.parse(v);
      return isNaN(t) ? null : new Date(t);
    };

    const now = new Date();
    const formatted: string = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;


    const lastActivity = parseDateOrNull(last_activity_at);
    const userId = cookies.user_id;
    const result = await pool.query(
      'INSERT INTO leads (client_name, deal_description, deal_value, last_activity_at, lead_source, column_entry_time, column_name, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [client_name, deal_description, deal_value, lastActivity, lead_source, formatted, column_name_final, userId]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to create lead.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  try {
    const body = await req.json();
    const { id, client_name, deal_description, deal_value, last_activity_at, lead_source, time_in_stage } = body;

    const parseDateOrNull = (v: any) => {
      if (v === null || v === undefined) return null;
      if (typeof v === 'string' && v.trim() === '') return null;
      const t = Date.parse(v);
      return isNaN(t) ? null : new Date(t);
    };

    const lastActivity = parseDateOrNull(last_activity_at);
    const columnEntryTime = parseDateOrNull(time_in_stage);
    const userId = cookies.user_id;
    const result = await pool.query(
      'UPDATE leads SET client_name = $1, deal_description = $2, deal_value = $3, last_activity_at = $4, lead_source = $5 WHERE id = $6 RETURNING *',
      [client_name, deal_description, deal_value, lastActivity, lead_source, id]
    );
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to update lead.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  try {
    const body = await req.json();
    const { id } = body;
    const userId = cookies.user_id;

    const result = await pool.query(
      'DELETE FROM leads WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Lead not found or unauthorized.' }, { status: 404 });
    }

    return NextResponse.json({ id: id, message: 'Lead deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Database Delete Error:', error);
    return NextResponse.json({ error: 'Failed to delete lead.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  try {
    const body = await req.json();
    const { id, column_name, columnName } = body;
    const column_name_final = column_name ?? columnName;
    const now = new Date();
    const formatted: string = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    if (!id || !column_name_final) {
      return NextResponse.json({ error: 'Lead ID and column name are required.' }, { status: 400 });
    }
    const result = await pool.query(
      'UPDATE leads SET column_name = $1, column_entry_time = $2 WHERE id = $3 RETURNING *',
      [column_name_final, formatted, id]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to update lead column.' }, { status: 500 });
  }
}