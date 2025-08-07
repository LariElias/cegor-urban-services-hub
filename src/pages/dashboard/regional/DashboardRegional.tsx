import React, { useMemo } from "react";
import { Card, CardHeader, CardContent, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, CheckCircle, TrendingUp, Download } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { mockOcorrencias } from "@/pages/ocorrencias/ListaOcorrencias";

import { CommonData } from "@/components/charts/types";
import ChartOcorrenciasPorBairro from "@/components/charts/ChartOcorrenciasPorBairro";
import ChartTipoEquipamentoPie from "@/components/charts/ChartTipoEquipamentoPie";


import ChartDistribuicaoRegional, { RegionalData } from "@/components/charts/ChartDistribuicaoRegional";

import ChartPrioridadePie, { PrioridadeData } from "@/components/charts/ChartPrioridadePie";
import ChartStatusDonut, { StatusData } from "@/components/charts/ChartStatusDonut";

function groupCount<T>(items: T[], getKey: (x: T) => string | undefined | null): CommonData[] {
  const map = new Map<string, number>();
  for (const it of items) {
    const key = (getKey(it) || "").trim();
    if (!key) continue;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function inferTipoEquipamento(o: any): string {
  const t = (o.equipment_type || o.tipo_equipamento || "").toString().trim();
  if (t) return t.toUpperCase();

  const nome = (o.public_equipment_name || "").toLowerCase();

  if (/\bpraça\b/.test(nome)) return "PRAÇA";
  if (/\bparque\b/.test(nome)) return "PARQUE";
  if (/\bareninha\b/.test(nome)) return "ARENINHA";
  if (/\bescola\b|\bprédio\b|\bcolégio\b/.test(nome)) return "PRÉDIO PÚBLICO";
  if (/\bcalçad(ão|ao)\b/.test(nome)) return "CALÇADÃO";
  if (/\bconj(unto)?\b/.test(nome)) return "CONJ HABITACIONAL";
  if (/\b(rua|avenida|av\.?|rodovia|rotatória|rotatoria|via|canal)\b/.test(nome)) return "TRECHO DE VIA";
  return "OUTROS";
}

function getRequester(o: any): string | undefined {
  return o.requester_name || o.requerente || undefined;
}



export default function DashboardRegional() {
  const { user } = useAuth();

  const kpis = { total: 156, criadas: 23, agendadas: 45, em_execucao: 34, concluidas: 54, pendentes: 70, media_tempo: 4.2, sla_atendimento: 87.5 };

  const ocorrenciasPorRegional: RegionalData[] = [
    { regional: "Regional 1", total: 50 },
    { regional: "Regional 2", total: 30 },
    { regional: "Regional 3", total: 76 },
  ];

  const ocorrenciasPorBairro: { name: string; value: number }[] = [
    { name: "Centro", value: 34 },
    { name: "Savassi", value: 22 },
    { name: "Funcionários", value: 18 },
    { name: "Lourdes", value: 16 },
    { name: "Barro Preto", value: 14 },
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

  const regionalId = user?.regional_id ? String(user.regional_id) : null;
  const tituloPainel = regionalId ? `Painel Regional ${regionalId}` : "Painel Regional";

  const ocorrenciasRegional = useMemo(
    () => mockOcorrencias.filter(o => String(o.regional_id) === regionalId),
    [regionalId]
  );

  const dataEquipamento: CommonData[] = useMemo(
    () => groupCount(ocorrenciasRegional, inferTipoEquipamento),
    [ocorrenciasRegional]
  );

  // const dataBairro: CommonData[] = useMemo(
  //   () => groupCount(ocorrenciasRegional, (o: any) => o.bairro),
  //   [ocorrenciasRegional]
  // );

  // const dataStatus: CommonData[] = useMemo(
  //   () => groupCount(ocorrenciasRegional, (o: any) => o.status),
  //   [ocorrenciasRegional]
  // );

  // const dataOrigem: CommonData[] = useMemo(
  //   () => groupCount(ocorrenciasRegional, (o: any) => o.origin),
  //   [ocorrenciasRegional]
  // );

  // const dataRequerente: CommonData[] = useMemo(
  //   () => groupCount(ocorrenciasRegional, getRequester).slice(0, 20),
  //   [ocorrenciasRegional]
  // );

  // const kpis = useMemo(() => {
  //   const total = ocorrenciasRegional.length;
  //   const emExecucao = ocorrenciasRegional.filter(o => o.status === "em_execucao").length;
  //   const concluidas = ocorrenciasRegional.filter(o => ["executada", "concluida"].includes(o.status)).length;
  //   const pendentes = ocorrenciasRegional.filter(o => ["criada", "agendada", "encaminhada", "autorizada"].includes(o.status)).length;
  //   return { total, emExecucao, concluidas, pendentes };
  // }, [ocorrenciasRegional]);

  // const exportarCSV = () => alert("Exportando relatório em CSV…");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{tituloPainel}</h1>
          <p className="text-gray-600">Somente dados da sua regional</p>
        </div>
        {/* <div className="flex items-center gap-4">
          <Button onClick={exportarCSV} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocorrências da Regional</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.total}</div>
            <p className="text-xs text-muted-foreground">Total registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.em_execucao}</div>
            <p className="text-xs text-muted-foreground">Sendo executadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.concluidas}</div>
            <p className="text-xs text-muted-foreground">Finalizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.pendentes}</div>
            <p className="text-xs text-muted-foreground">Aguardando ação</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartTipoEquipamentoPie data={dataEquipamento} />

        <ChartOcorrenciasPorBairro data={ocorrenciasPorBairro} />

        <ChartStatusDonut data={statusData} />

        <ChartPrioridadePie data={ocorrenciasPorPrioridade} />

        {/* <ChartOrigemDemanda data={dataOrigem} /> */}


        {/* <div className="xl:col-span-2">
          <ChartServicosPorRequerente data={dataRequerente} />
        </div> */}
      </div>
    </div>
  );
}
