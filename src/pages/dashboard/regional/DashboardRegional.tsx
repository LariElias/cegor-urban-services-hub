import React, { useMemo } from "react";
import { Card, CardHeader, CardContent, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, CheckCircle, TrendingUp, Download } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { mockOcorrencias } from "@/pages/ocorrencias/ListaOcorrencias";

import { CommonData } from "@/components/charts/types";
import ChartOcorrenciasPorBairro from "@/components/charts/ChartOcorrenciasPorBairro";
import ChartTipoEquipamentoPie from "@/components/charts/ChartTipoEquipamentoPie";
import ChartOrigemDemanda from "@/components/charts/ChartOrigemdemanda";
import ChartStatusBar from "@/components/charts/ChartStatusBar";
import ChartServicosPorRequerente from "@/components/charts/ChartServicosPorRequerente";

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

  const dataBairro: CommonData[] = useMemo(
    () => groupCount(ocorrenciasRegional, (o: any) => o.bairro),
    [ocorrenciasRegional]
  );

  const dataStatus: CommonData[] = useMemo(
    () => groupCount(ocorrenciasRegional, (o: any) => o.status),
    [ocorrenciasRegional]
  );

  const dataOrigem: CommonData[] = useMemo(
    () => groupCount(ocorrenciasRegional, (o: any) => o.origin),
    [ocorrenciasRegional]
  );

  const dataRequerente: CommonData[] = useMemo(
    () => groupCount(ocorrenciasRegional, getRequester).slice(0, 20),
    [ocorrenciasRegional]
  );

  const kpis = useMemo(() => {
    const total = ocorrenciasRegional.length;
    const emExecucao = ocorrenciasRegional.filter(o => o.status === "em_execucao").length;
    const concluidas = ocorrenciasRegional.filter(o => ["executada", "concluida"].includes(o.status)).length;
    const pendentes = ocorrenciasRegional.filter(o => ["criada", "agendada", "encaminhada", "autorizada"].includes(o.status)).length;
    return { total, emExecucao, concluidas, pendentes };
  }, [ocorrenciasRegional]);

  const exportarCSV = () => alert("Exportando relatório em CSV…");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{tituloPainel}</h1>
          <p className="text-gray-600">Somente dados da sua regional</p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={exportarCSV} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </div>
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
            <div className="text-2xl font-bold">{kpis.emExecucao}</div>
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

        <ChartOcorrenciasPorBairro data={dataBairro} />

        <ChartStatusBar data={dataStatus} />



        <ChartOrigemDemanda data={dataOrigem} />


        <div className="xl:col-span-2">
          <ChartServicosPorRequerente data={dataRequerente} />
        </div>
      </div>
    </div>
  );
}
