
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Calendar, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function DashboardEmpresa() {
  const { user } = useAuth();

  // Mock data - em produção viria da API filtrada por empresa
  const servicosHoje = [
    {
      id: '1',
      protocol: 'OCR-2024-001',
      description: 'Limpeza de terreno baldio',
      address: 'Rua das Flores, 123',
      scheduled_time: '08:00',
      priority: 'alta',
      status: 'agendada',
    },
    {
      id: '2',
      protocol: 'OCR-2024-002',
      description: 'Reparo em calçada',
      address: 'Av. Brasil, 456',
      scheduled_time: '14:00',
      priority: 'media',
      status: 'agendada',
    },
  ];

  const servicosAmanha = [
    {
      id: '3',
      protocol: 'OCR-2024-003',
      description: 'Poda de árvores',
      address: 'Rua das Palmeiras, 789',
      scheduled_time: '09:00',
      priority: 'baixa',
      status: 'agendada',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baixa': return 'bg-green-100 text-green-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'urgente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportarCSV = () => {
    // Implementar exportação CSV
    alert('Exportando serviços programados em CSV...');
  };

  // Verificar permissões
  if (user?.role !== 'empresa') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Acesso negado. Apenas usuários de empresa podem acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Serviços Programados</h1>
        <Button onClick={exportarCSV} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servicosHoje.length}</div>
            <p className="text-xs text-muted-foreground">
              Serviços agendados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amanhã</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servicosAmanha.length}</div>
            <p className="text-xs text-muted-foreground">
              Serviços agendados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servicosHoje.length + servicosAmanha.length}</div>
            <p className="text-xs text-muted-foreground">
              Próximos 2 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Serviços de Hoje */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Serviços de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Protocolo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Prioridade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicosHoje.map((servico) => (
                <TableRow key={servico.id}>
                  <TableCell className="font-medium">{servico.protocol}</TableCell>
                  <TableCell>{servico.description}</TableCell>
                  <TableCell>{servico.address}</TableCell>
                  <TableCell>{servico.scheduled_time}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(servico.priority)}>
                      {servico.priority}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Serviços de Amanhã */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Serviços de Amanhã
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Protocolo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Prioridade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicosAmanha.map((servico) => (
                <TableRow key={servico.id}>
                  <TableCell className="font-medium">{servico.protocol}</TableCell>
                  <TableCell>{servico.description}</TableCell>
                  <TableCell>{servico.address}</TableCell>
                  <TableCell>{servico.scheduled_time}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(servico.priority)}>
                      {servico.priority}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
