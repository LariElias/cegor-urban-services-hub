
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, CheckCircle, TrendingUp, Users, Building, Download } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isRegionalGestor, isCegorGestor } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();

  const dashboardData = {
    totalOcorrencias: 1247,
    ocorrenciasPendentes: 156,
    ocorrenciasAndamento: 89,
    ocorrenciasConcluidas: 1002,
    regionaisAtivas: 9,
    empresasContratadas: 15,
    demandasPorRegional: 284,
    pendenteAprovacao: 23,
  };

  // Dados para o gráfico de demandas por regional
  const demandaRegionalData = [
    { name: 'Regional 1', demandas: 45 },
    { name: 'Regional 2', demandas: 38 },
    { name: 'Regional 3', demandas: 32 },
    { name: 'Regional 4', demandas: 28 },
    { name: 'Regional 5', demandas: 25 },
    { name: 'Regional 6', demandas: 22 },
    { name: 'Regional 7', demandas: 20 },
    { name: 'Regional 8', demandas: 18 },
    { name: 'Regional 9', demandas: 15 },
  ];

  const recentOcorrencias = [
    {
      id: '1',
      protocol: 'OCR-2024-001',
      description: 'Limpeza de via pública - Rua da Bahia',
      status: 'agendada',
      priority: 'alta',
      regional: 'Centro-Sul',
      date: '2024-01-15',
    },
    {
      id: '2',
      protocol: 'OCR-2024-002',
      description: 'Manutenção de iluminação pública',
      status: 'em_execucao',
      priority: 'media',
      regional: 'Noroeste',
      date: '2024-01-14',
    },
    {
      id: '3',
      protocol: 'OCR-2024-003',
      description: 'Poda de árvores - Praça da Liberdade',
      status: 'concluida',
      priority: 'baixa',
      regional: 'Centro-Sul',
      date: '2024-01-13',
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      criada: { label: 'Criada', className: 'bg-gray-100 text-gray-800' },
      agendada: { label: 'Agendada', className: 'bg-blue-100 text-blue-800' },
      em_execucao: { label: 'Em Execução', className: 'bg-yellow-100 text-yellow-800' },
      concluida: { label: 'Concluída', className: 'bg-green-100 text-green-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      baixa: { label: 'Baixa', className: 'bg-green-100 text-green-800' },
      media: { label: 'Média', className: 'bg-yellow-100 text-yellow-800' },
      alta: { label: 'Alta', className: 'bg-orange-100 text-orange-800' },
      urgente: { label: 'Urgente', className: 'bg-red-100 text-red-800' },
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const exportarCSV = () => {
    alert('Exportando relatório em CSV...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel de regionais</h1>
          <p className="text-gray-600">
            {user?.role === 'regional' ? 'Painel da Regional' : 'Visão geral do sistema CEGOR'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {isCegorGestor(user) && (
            <Button onClick={exportarCSV} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
          )}
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === 'regional' ? 'Ocorrências da Regional' : 'Total de Ocorrências'}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.role === 'regional' ? '45' : dashboardData.totalOcorrencias}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isRegionalGestor(user) ? 'Pendentes de Aprovação' : 'Pendentes'}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isRegionalGestor(user) ? dashboardData.pendenteAprovacao : dashboardData.ocorrenciasPendentes}
            </div>
            <p className="text-xs text-muted-foreground">
              {isRegionalGestor(user) ? 'Aguardando sua aprovação' : 'Aguardando agendamento'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.role === 'regional' ? '12' : dashboardData.ocorrenciasAndamento}
            </div>
            <p className="text-xs text-muted-foreground">
              Sendo executadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.role === 'regional' ? '28' : dashboardData.ocorrenciasConcluidas}
            </div>
            <p className="text-xs text-muted-foreground">
              Finalizadas este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Card adicional de demandas por regional para CEGOR */}
      {isCegorGestor(user) && (
        <Card>
          <CardHeader>
            <CardTitle>Ocorrências por Regional</CardTitle>
            <CardDescription>
              Distribuição de ocorrências criadas e encaminhadas por regional (últimos 30 dias)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-2xl font-bold text-blue-600">{dashboardData.demandasPorRegional}</div>
              <p className="text-sm text-muted-foreground">Total de demandas este mês</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demandaRegionalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="demandas" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Informações do sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Resumo do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Regionais Ativas</span>
              <Badge variant="outline">{dashboardData.regionaisAtivas}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Empresas Contratadas</span>
              <Badge variant="outline">{dashboardData.empresasContratadas}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Usuários Ativos</span>
              <Badge variant="outline">127</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ocorrências Recentes</CardTitle>
            <CardDescription>
              Últimas ocorrências registradas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOcorrencias.map((ocorrencia) => (
                <div key={ocorrencia.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{ocorrencia.protocol}</span>
                      {getStatusBadge(ocorrencia.status)}
                      {getPriorityBadge(ocorrencia.priority)}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{ocorrencia.description}</p>
                    <p className="text-xs text-gray-500">{ocorrencia.regional} • {ocorrencia.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
