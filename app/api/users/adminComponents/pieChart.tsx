'use client';

import { useEffect, useState } from 'react';
import { Pie, PieChart, Tooltip, Legend, Cell } from 'recharts';
import axios from 'axios';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a4de6c', '#d0ed57', '#ff8042', '#c77dff', '#7dd0ff'];

interface LeadStats {
  name: string;
  value: number;
  [key: string]: string | number;
}

export default function LeadsPieChart({ isAnimationActive = true }: { isAnimationActive?: boolean }) {
  const [data, setData] = useState<LeadStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/leads/stats?reportName=pieChart');
        setData(response.data);
      } catch (err: any) {
        console.error('Error fetching lead stats:', err);
        setError('Failed to load lead statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading statistics...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  if (data.length === 0) return <div style={{ padding: '20px' }}>No lead data available.</div>;

  return (
    <PieChart
      style={{ width: '100%', height: '100%', maxWidth: '500px', maxHeight: '80vh', aspectRatio: 1 }}
      responsive
    >
      <Pie
        data={data}
        dataKey="value"
        cx="50%"
        cy="50%"
        outerRadius={80}
        // fill="#8884d8" // Removed fill from Pie to use Cell colors
        isAnimationActive={isAnimationActive}
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}