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
  const {logout} = useAuth();

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

  const logOut = () => {
        // Call the logout function from the hook and redirect to signup/login
        logout();
        router.push('/auth/login');
  }

  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!isAuthenticated || role !== 'admin') {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Access Denied</div>;
  }

  return (
    <div>
      <div className='h-[50px] w-screen bg-[#1B3C53] flex items-center justify-end pr-[20px]'>
            <p onClick={logOut} className='text-white underline font-bold cursor-pointer hover:text-blue-500'>Logout</p>
        </div>
      <h1>Admin Dashboard</h1>
      <LeadsPieChart />
      <LeadsBarChart />
      <LeadsLineChart />
    </div>
  );
}