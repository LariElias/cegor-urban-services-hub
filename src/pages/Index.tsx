import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { Layout } from '@/components/Layout';
import Dashboard from '@/pages/dashboard/Dashboard';
import DashboardCegor from './dashboard/cegor/DashboardCegor';
import DashboardRegional from './dashboard/regional/DashboardRegional';
import DashboardEmpresa from './dashboard/empresa/DashboardEmpresa';
import DashboardFiscAndOpe from './dashboard/DashboardFiscAndOpe';

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const role = user?.role;
  const subrole = user?.subrole?.toLowerCase(); // normaliza para evitar erro por letras maiúsculas

  let dashboard;

  if (role === 'cegor') {
    if (subrole === 'gerente' || subrole === 'gestor') {
      dashboard = <DashboardCegor />;
    } else if (subrole === 'operador' || subrole === 'fiscal') {
      dashboard = <DashboardFiscAndOpe />;
    }
  } else if (role === 'regional') {
    if (subrole === 'gestor') {
      dashboard = <DashboardRegional />;
    } else if (subrole === 'operador' || subrole === 'fiscal') {
      dashboard = <DashboardFiscAndOpe />;
    }
  } else if (role === 'empresa') {
    dashboard = <DashboardEmpresa />;
  } else {
    dashboard = <Dashboard />;
  }

  return <Layout>{dashboard}</Layout>;
};

export default Index;
