
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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

  const ocorrenciasPorBairro = [
    { bairro: 'Centro', total: 34, concluidas: 28 },
    { bairro: 'Savassi', total: 22, concluidas: 18 },
    { bairro: 'Funcionários', total: 18, concluidas: 15 },
    { bairro: 'Lourdes', total: 16, concluidas: 12 },
    { bairro: 'Barro Preto', total: 14, concluidas: 11 },
  ];

  const exportarCSV = () => {
    // Implementar exportação CSV
    alert('Exportando relatório em CSV...');
  };

  // Verificar permissões
  if (user?.role !== 'cegor') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Acesso negado. Apenas usuários CEGOR podem acessar esta página.</p>
      </div>
    );
  }

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
      <Card>
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
      </Card>

      {/* Heat Map por Bairro */}
      <Card>
        <CardHeader>
          <CardTitle>Ocorrências por Bairro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ocorrenciasPorBairro.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">{item.bairro}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {item.concluidas}/{item.total} concluídas
                  </span>
                  <Badge variant="outline">
                    {((item.concluidas / item.total) * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
