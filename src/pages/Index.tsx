import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { Layout } from '@/components/Layout';
import Dashboard from '@/pages/dashboard/Dashboard';
import DashboardCegor from './dashboard/cegor/DashboardCegor';
import DashboardRegional from './dashboard/regional/DashboardRegional';
import DashboardEmpresa from './dashboard/empresa/DashboardEmpresa';
const Index = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <Layout>
      {user?.role === 'cegor' ? <DashboardCegor /> : user.role === 'empresa' ? <DashboardEmpresa /> : user.role === 'regional' ? <DashboardRegional /> : <Dashboard />}
    </Layout>
  );
};

export default Index;
