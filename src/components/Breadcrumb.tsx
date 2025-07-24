
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const { user } = useAuth();

  const getBreadcrumbName = (segment: string, index: number) => {
    const names: Record<string, string> = {
      'cadastros': 'Cadastros',
      'regionais': 'Regionais',
      'bairros': 'Bairros',
      'territorios': 'Territórios',
      'fiscais': 'Fiscais',
      'zgl': 'ZGL',
      'equipamentos': 'Equipamentos Públicos',
      'empresas': 'Empresas Contratadas',
      'equipes': 'Equipes',
      'ocorrencias': 'Ocorrências',
      'nova': 'Nova Ocorrência',
      'relatorios': 'Relatórios',
      'dashboard': 'Dashboard Geral',
      'regional': 'Relatório Regional',
      'programados': 'Serviços Programados',
      'tempo': 'Tempo de Execução',
      'csv': 'Exportar CSV',
    };

    return names[segment] || segment;
  };

  const buildPath = (index: number) => {
    return '/' + pathSegments.slice(0, index + 1).join('/');
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 justify-between">
      <Link 
        to="/" 
        className="flex items-center hover:text-[#0B5CF0] transition-colors p-1 rounded-md hover:bg-gray-100"
      >
        <Home className="w-4 h-4" />
        <span className="ml-1">Dashboard teste</span>
      </Link>
      
      {pathSegments.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {index === pathSegments.length - 1 ? (
            <span className="text-gray-900 font-medium">
              {getBreadcrumbName(segment, index)}
            </span>
          ) : (
            <Link
              to={buildPath(index)}
              className="hover:text-[#0B5CF0] transition-colors p-1 rounded-md hover:bg-gray-100"
            >
              {getBreadcrumbName(segment, index)}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
