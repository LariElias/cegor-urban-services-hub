
import React, { useState } from 'react';
import { Clock, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function TempoExecucao() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    empresa: '',
    regional: '',
    dataInicio: '',
    dataFim: '',
  });

  // Mock data para gráficos
  const dadosBarras = [
    { nome: 'OCR-001', planejado: 8, real: 10 },
    { nome: 'OCR-002', planejado: 12, real: 8 },
    { nome: 'OCR-003', planejado: 6, real: 7 },
    { nome: 'OCR-004', planejado: 15, real: 18 },
    { nome: 'OCR-005', planejado: 10, real: 9 },
  ];

  const dadosLinha = [
    { semana: 'Sem 1', media: -1.2 },
    { semana: 'Sem 2', media: 2.5 },
    { semana: 'Sem 3', media: 0.8 },
    { semana: 'Sem 4', media: -0.5 },
  ];

  const exportToCSV = () => {
    const headers = ['Ocorrência', 'Tempo Planejado (h)', 'Tempo Real (h)', 'Diferença (h)'];
    const csvContent = [
      headers.join(','),
      ...dadosBarras.map(item => [
        item.nome,
        item.planejado,
        item.real,
        item.real - item.planejado
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'tempo_execucao.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (user?.role === 'empresa') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Acesso negado. Relatório disponível apenas para CEGOR e Regional.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Clock className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Tempo de Execução</h1>
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {user?.role === 'cegor' && (
              <div>
                <Label htmlFor="empresa">Empresa</Label>
                <Select value={filters.empresa} onValueChange={(value) => setFilters({...filters, empresa: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="1">Empresa Limpeza BH</SelectItem>
                    <SelectItem value="2">Serviços Urbanos Ltda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {user?.role === 'cegor' && (
              <div>
                <Label htmlFor="regional">Regional</Label>
                <Select value={filters.regional} onValueChange={(value) => setFilters({...filters, regional: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="1">Regional Centro-Sul</SelectItem>
                    <SelectItem value="2">Regional Norte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={filters.dataInicio}
                onChange={(e) => setFilters({...filters, dataInicio: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={filters.dataFim}
                onChange={(e) => setFilters({...filters, dataFim: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Barras - Tempo Planejado vs Real */}
      <Card>
        <CardHeader>
          <CardTitle>Tempo Planejado × Tempo Real por Ocorrência</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dadosBarras}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="planejado" fill="#8884d8" name="Tempo Planejado (h)" />
              <Bar dataKey="real" fill="#82ca9d" name="Tempo Real (h)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Linha - Média de Atraso/Adiantamento */}
      <Card>
        <CardHeader>
          <CardTitle>Média de Atraso/Adiantamento por Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dadosLinha}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semana" />
              <YAxis label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="media" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Média de Diferença (h)"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>• Valores positivos indicam atraso em relação ao planejado</p>
            <p>• Valores negativos indicam adiantamento em relação ao planejado</p>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">-0.2h</p>
              <p className="text-sm text-muted-foreground">Média Geral</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">+3.0h</p>
              <p className="text-sm text-muted-foreground">Maior Atraso</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">-4.0h</p>
              <p className="text-sm text-muted-foreground">Maior Adiantamento</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
