import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import ChartDistribuicaoRegional, { RegionalData } from "@/components/charts/ChartDistribuicaoRegional";
import ChartOcorrenciasPorBairro, { BairroData } from "@/components/charts/ChartOcorrenciasPorBairro";
import ChartPrioridadePie, { PrioridadeData } from "@/components/charts/ChartPrioridadePie";
import ChartStatusDonut, { StatusData } from "@/components/charts/ChartStatusDonut";

export default function DashboardGeral() {
  const { user } = useAuth();

  // Mocks (substitua pela API)
  const kpis = { total: 156, criadas: 23, agendadas: 45, em_execucao: 34, concluidas: 54, media_tempo: 4.2, sla_atendimento: 87.5 };

  const ocorrenciasPorRegional: RegionalData[] = [
    { regional: "Regional 1", total: 50 },
    { regional: "Regional 2", total: 30 },
    { regional: "Regional 3", total: 76 },
  ];

  const ocorrenciasPorBairro: BairroData[] = [
    { bairro: "Centro", total: 34, concluidas: 28 },
    { bairro: "Savassi", total: 22, concluidas: 18 },
    { bairro: "Funcionários", total: 18, concluidas: 15 },
    { bairro: "Lourdes", total: 16, concluidas: 12 },
    { bairro: "Barro Preto", total: 14, concluidas: 11 },
  ];

  const ocorrenciasPorPrioridade: PrioridadeData[] = [
    { prioridade: "Alta", total: 60 },
    { prioridade: "Média", total: 50 },
    { prioridade: "Baixa", total: 46 },
  ];

  const statusData: StatusData[] = [
    { name: "Criadas", value: kpis.criadas },
    { name: "Agendadas", value: kpis.agendadas },
    { name: "Execução", value: kpis.em_execucao },
    { name: "Concluídas", value: kpis.concluidas },
  ];

  const exportarCSV = () => alert("Exportando relatório em CSV...");

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
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Execução</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.em_execucao}</div>
            <p className="text-xs text-muted-foreground">Sendo executadas atualmente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.concluidas}</div>
            <p className="text-xs text-muted-foreground">{((kpis.concluidas / kpis.total) * 100).toFixed(1)}% do total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA de Atendimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.sla_atendimento}%</div>
            <p className="text-xs text-muted-foreground">Dentro do prazo estabelecido</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos (cada um vira um componente com expansão) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartDistribuicaoRegional data={ocorrenciasPorRegional} />
        <ChartOcorrenciasPorBairro data={ocorrenciasPorBairro} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartPrioridadePie data={ocorrenciasPorPrioridade} />
        <ChartStatusDonut data={statusData} />
      </div>
    </div>
  );
}
