import React, { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  TrendingUp,
  Building,
  Download,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  isRegionalGestor,
  isCegorGestor,
} from "@/types";

import { CommonData } from "@/components/charts/types";
import ChartStatusBar from "@/components/charts/ChartStatusBar";
import ChartOcorrenciasPorBairro from "@/components/charts/ChartOcorrenciasPorBairro";
import ChartTipoEquipamentoPie from "@/components/charts/ChartTipoEquipamentoPie";
import ChartOrigemDemanda from "@/components/charts/ChartOrigemdemanda";
import ChartServicosPorRequerente from "@/components/charts/ChartServicosPorRequerente";

import ChartDistribuicaoRegional, { RegionalData } from "@/components/charts/ChartDistribuicaoRegional";
import ChartPrioridadePie, { PrioridadeData } from "@/components/charts/ChartPrioridadePie";
import ChartStatusDonut, { StatusData } from "@/components/charts/ChartStatusDonut";

import EquipesEmCampoCard, { buildEquipesOcupadas } from "@/components/dashboard/EquipesEmCampoCard";
import { mockOcorrencias } from "@/pages/ocorrencias/ListaOcorrencias";
import { useNavigate } from "react-router-dom";

const statusData: CommonData[] = [
  { name: "EXECUTADO", value: 181 },
  { name: "EM EXECUÇÃO", value: 12 },
  { name: "AGUARDANDO EXEC.", value: 3 },
];

const bairroData: CommonData[] = [
  { name: "VILA VELHA", value: 10 },
  { name: "CENTRO", value: 9 },
  { name: "Aldeota", value: 7 },
  { name: "PARANGABA", value: 7 },
  { name: "Messejana", value: 6 },
  { name: "CANINDEZINHO", value: 5 },
  { name: "CONJUNTO …", value: 5 },   // legenda truncada no print
  { name: "GRANJA LIS…", value: 5 },
  { name: "Jangurusu", value: 5 },
  { name: "JOÃO XXIII", value: 5 },
  { name: "SIQUEIRA", value: 5 },
  { name: "José Walter", value: 4 },
];

const equipamentoData: CommonData[] = [
  { name: "TRECHO DE VIA", value: 92 },
  { name: "PRAÇA", value: 61 },
  { name: "ARENINHA", value: 20 },
  { name: "PRÉDIO PÚBLICO", value: 15 },
  { name: "CALÇADÃO", value: 3 },  // fatias pequenas
  { name: "CONJ HABITACIONAL", value: 3 },
  { name: "PARQUE", value: 2 },
];

const origemData: CommonData[] = [
  { name: "OUTROS", value: 186 },
  { name: "OFÍCIO", value: 10 },
];

const requerenteData: CommonData[] = [
  { name: "ANTONIO LU…", value: 13 },
  { name: "EDIEL SOUZA", value: 9 },
  { name: "YURI JIVAGO", value: 6 },
  { name: "Chiquinho do…", value: 4 },
  { name: "Júlio Brasil", value: 4 },
  { name: "ANDREZA AL…", value: 3 },
  { name: "Germano He…", value: 2 },
  { name: "Irmão Léo", value: 2 },
  { name: "Assessor Joa…", value: 1 },
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

export default function Dashboard() {
  const { user } = useAuth();

  const navigate = useNavigate(); // opcional
  const equipesOcupadas = useMemo(() => buildEquipesOcupadas(mockOcorrencias), []);

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

  // const exportarCSV = () => {
  //   alert('Exportando relatório em CSV...');
  // };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel de regionais</h1>
          <p className="text-gray-600">
            {user?.role === 'regional' ? 'Painel da Regional' : 'Visão geral do sistema CEGOR'}
          </p>
        </div>
        {/* <div className="flex items-center gap-4">
          {isCegorGestor(user) && (
            // <Button onClick={exportarCSV} variant="outline" className="flex items-center gap-2">
            //   <Download className="w-4 h-4" />
            //   Exportar CSV
            // </Button>
          )}
        </div> */}
      </div>

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
      {/* 

      <EquipesEmCampoCard
        items={equipesOcupadas}
        onGoToOcorrencia={(id) => navigate(`/ocorrencias/${id}`)}
      /> */}

      {/* 2) NOVO bloco de gráficos                            */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartStatusBar data={statusData} />
        <ChartOcorrenciasPorBairro data={bairroData} />
        <ChartTipoEquipamentoPie data={equipamentoData} />
        <ChartOrigemDemanda data={origemData} />
        <ChartDistribuicaoRegional data={ocorrenciasPorRegional} />
        <ChartOcorrenciasPorBairro data={ocorrenciasPorBairro} />
        <ChartPrioridadePie data={ocorrenciasPorPrioridade} />
        <ChartStatusDonut data={statusData} />
      </div>

    </div>
  );
}
