"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import LeadsBarChart from "../../adminComponents/barChart";
import LeadsLineChart from "../../adminComponents/lineChart";
import LeadsPieChart from "../../adminComponents/pieChart";

export default function AdminPage() {
  const { isAuthenticated, isLoading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Not authenticated, redirect to login
        router.push('/auth/login');
        return;
      }
      if (role !== 'admin') {
        // Authenticated but not an admin, redirect to regular dashboard
        router.push('/');
        return;
      }
    }
  }, [isAuthenticated, isLoading, role, router]);

  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!isAuthenticated || role !== 'admin') {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Access Denied</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <LeadsPieChart />
      <LeadsBarChart />
      <LeadsLineChart />
    </div>
  );
}