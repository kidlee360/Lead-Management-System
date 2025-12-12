 'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface LeadStats {
  name: string;
  value: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a4de6c'];

export default function LeadsBarChart({ isAnimationActive = true }: { isAnimationActive?: boolean }) {
  const [data, setData] = useState<LeadStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/leads/stats?reportName=barChart');
        setData(response.data);
      } catch (err: any) {
        console.error('Error fetching lead stats for bar chart:', err);
        setError('Failed to load bar chart data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading bar chart...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  if (data.length === 0) return <div style={{ padding: '20px' }}>No data to display.</div>;

  return (
    <div style={{ width: '100%', height: 300, maxWidth: 800 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" isAnimationActive={isAnimationActive}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}