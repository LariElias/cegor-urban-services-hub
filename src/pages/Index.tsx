
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { Layout } from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';

const Index = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Index;
