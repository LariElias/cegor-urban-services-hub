
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export default function DashboardGeral() {
  const { user } = useAuth();

  // Mock data - em produção viria da API
  const kpis = {
    total: 156,
    criadas: 23,
    agendadas: 45,
    em_execucao: 34,
    concluidas: 54,
    media_tempo: 4.2,
    sla_atendimento: 87.5,
  };

  const ocorrenciasPorRegional = [
    { regional: 'Regional 1', total: 50 },
    { regional: 'Regional 2', total: 30 },
    { regional: 'Regional 3', total: 76 },
  ];

  const ocorrenciasPorBairro = [
    { bairro: 'Centro', total: 34, concluidas: 28 },
    { bairro: 'Savassi', total: 22, concluidas: 18 },
    { bairro: 'Funcionários', total: 18, concluidas: 15 },
    { bairro: 'Lourdes', total: 16, concluidas: 12 },
    { bairro: 'Barro Preto', total: 14, concluidas: 11 },
  ];

  const ocorrenciasPorPrioridade = [
    { prioridade: 'Alta', total: 60 },
    { prioridade: 'Média', total: 50 },
    { prioridade: 'Baixa', total: 46 },
  ];

  const statusData = [
    { name: 'Criadas', value: kpis.criadas },
    { name: 'Agendadas', value: kpis.agendadas },
    { name: 'Execução', value: kpis.em_execucao },
    { name: 'Concluídas', value: kpis.concluidas },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const exportarCSV = () => {
    // Implementar exportação CSV
    alert('Exportando relatório em CSV...');
  };

  // // Verificar permissões
  // if (user?.role !== 'cegor') {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <p className="text-muted-foreground">Acesso negado. Apenas usuários CEGOR podem acessar esta página.</p>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Geral</h1>
        <Button onClick={exportarCSV} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ocorrências</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.total}</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Execução</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.em_execucao}</div>
            <p className="text-xs text-muted-foreground">
              Sendo executadas atualmente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.concluidas}</div>
            <p className="text-xs text-muted-foreground">
              {((kpis.concluidas / kpis.total) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA de Atendimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.sla_atendimento}%</div>
            <p className="text-xs text-muted-foreground">
              Dentro do prazo estabelecido
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição por Status */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Distribuição por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-gray-100 text-gray-800">Criadas</Badge>
              <span className="text-sm font-medium">{kpis.criadas}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">Agendadas</Badge>
              <span className="text-sm font-medium">{kpis.agendadas}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-800">Em Execução</Badge>
              <span className="text-sm font-medium">{kpis.em_execucao}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">Concluídas</Badge>
              <span className="text-sm font-medium">{kpis.concluidas}</span>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Heat Map por Bairro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {/* Pizza Regional */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição Regional</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={ocorrenciasPorRegional}
                margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
              >
                <XAxis type="number" />
                <YAxis
                  dataKey="regional"
                  type="category"
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="total" fill={COLORS[0]} name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bairro - Barras */}
        <Card>
          <CardHeader>
            <CardTitle>Ocorrências por Bairro</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ocorrenciasPorBairro} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bairro" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Total" />
                <Bar dataKey="concluidas" fill="#82ca9d" name="Concluídas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">

        {/* Prioridade - Pizza */}
        <Card>
          <CardHeader>
            <CardTitle>Prioridade</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ocorrenciasPorPrioridade}
                  dataKey="total"
                  nameKey="prioridade"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {ocorrenciasPorPrioridade.map((entry, index) => (
                    <Cell key={`cell-prio-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status - Pizza */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-status-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
