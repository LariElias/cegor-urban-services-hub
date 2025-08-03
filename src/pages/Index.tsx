import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { Layout } from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import DashboardCegor from './DashBoardCegor';

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <Layout>
      {user?.role === 'cegor' ? <DashboardCegor /> : <Dashboard />}
    </Layout>
  );
};

export default Index;
