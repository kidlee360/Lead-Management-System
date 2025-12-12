import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import cookie from 'cookie';

export async function GET(req: Request) {
  try {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const userId = cookies.user_id;
    const { searchParams } = new URL(req.url);
    const reportName = searchParams.get('reportName');

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated.' }, { status: 401 });
    }

    if (reportName === 'pieChart') {
      const result = await pool.query(
        'SELECT column_name as name, COUNT(*)::int as value FROM leads WHERE user_id = $1 GROUP BY column_name',
        [userId]
      );

      const data = result.rows.map((row) => ({
        name: row.name,
        value: Number(row.value),
      }));

      return NextResponse.json(data, { status: 200 });
    } else if (reportName === 'barChart') {
      const result = await pool.query(
        'SELECT lead_source as name, SUM(COALESCE(deal_value,0))::numeric as value FROM leads WHERE user_id = $1 GROUP BY lead_source',
        [userId]
      );
      const data = result.rows.map((row) => ({ name: row.name, value: Number(row.value) }));
      return NextResponse.json(data, { status: 200 });
    } else if (reportName === 'lineChart') {
      const result = await pool.query(
        "SELECT DATE_TRUNC('month', column_entry_time) as month, COUNT(id)::int as value FROM leads WHERE user_id = $1 GROUP BY month ORDER BY month ASC",
        [userId]
      );
      const data = result.rows.map((row) => ({
        name: new Date(row.month).toISOString().slice(0, 10),
        value: Number(row.value),
      }));
      return NextResponse.json(data, { status: 200 });
    } else if (reportName === 'timeInStage') {
      // Compute average time in hours per stage using lead_history. For open records use NOW().
      const result = await pool.query(
        `SELECT lh.stage_id as name,
                AVG(EXTRACT(EPOCH FROM (COALESCE(lh.left_at, NOW()) - lh.entered_at)))/3600.0 AS avg_hours,
                COUNT(*)::int AS entries
         FROM lead_history lh
         JOIN leads l ON l.id = lh.lead_id
         WHERE l.user_id = $1
         GROUP BY lh.stage_id
         ORDER BY avg_hours DESC`,
        [userId]
      );

      const data = result.rows.map((row) => ({
        name: row.name,
        // Return average hours as a float with two decimals
        value: Number(Number(row.avg_hours || 0).toFixed(2)),
        entries: Number(row.entries || 0),
      }));

      return NextResponse.json(data, { status: 200 });
    }
    
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch lead stats.' }, { status: 500 });
  }
}
