import React, { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import {
  isRegionalGestor,
  isCegorGestor,
} from "@/types";

export default function DashboardFiscAndOpe() {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Principal</h1>
          <p className="text-gray-600">
            {user?.role === 'regional' ? 'Painel da Regional' : 'Visão geral do sistema CEGOR'}
          </p>
        </div>
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
  );
}
