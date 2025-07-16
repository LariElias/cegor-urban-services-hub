
import React, { useState } from 'react';
import { History, Search, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { Ocorrencia } from '@/types';

export default function HistoricoOcorrencias() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    tipo: '',
    empresa: '',
    regional: '',
    prioridade: '',
    dataInicio: '',
    dataFim: '',
  });

  // Mock data - em produção viria da API
  const [ocorrencias] = useState<Ocorrencia[]>([
    {
      id: '1',
      protocol: 'OCR-2024-001',
      description: 'Limpeza de terreno baldio',
      service_type: 'Limpeza',
      priority: 'alta',
      status: 'concluida',
      address: 'Rua das Flores, 123',
      regional_id: '1',
      fiscal_id: '1',
      completed_at: '2024-01-15T10:30:00Z',
      created_at: '2024-01-10T08:00:00Z',
      updated_at: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      protocol: 'OCR-2024-002',
      description: 'Reparo em calçada',
      service_type: 'Manutenção',
      priority: 'media',
      status: 'cancelada',
      address: 'Av. Brasil, 456',
      regional_id: '2',
      fiscal_id: '1',
      cancel_reason: 'Orçamento indisponível',
      created_at: '2024-01-12T09:00:00Z',
      updated_at: '2024-01-14T16:00:00Z',
    },
    {
      id: '3',
      protocol: 'OCR-2024-003',
      description: 'Poda de árvores',
      service_type: 'Conservação',
      priority: 'baixa',
      status: 'concluida',
      address: 'Praça Central, s/n',
      regional_id: '1',
      fiscal_id: '1',
      completed_at: '2024-01-20T14:00:00Z',
      created_at: '2024-01-15T11:00:00Z',
      updated_at: '2024-01-20T14:00:00Z',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'criada': return 'bg-gray-100 text-gray-800';
      case 'encaminhada': return 'bg-blue-100 text-blue-800';
      case 'autorizada': return 'bg-purple-100 text-purple-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      case 'devolvida': return 'bg-orange-100 text-orange-800';
      case 'em_analise': return 'bg-yellow-100 text-yellow-800';
      case 'agendada': return 'bg-purple-100 text-purple-800';
      case 'em_execucao': return 'bg-blue-100 text-blue-800';
      case 'concluida': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'criada': return 'Criada';
      case 'encaminhada': return 'Encaminhada';
      case 'autorizada': return 'Autorizada';
      case 'cancelada': return 'Cancelada';
      case 'devolvida': return 'Devolvida';
      case 'em_analise': return 'Em Análise';
      case 'agendada': return 'Agendada';
      case 'em_execucao': return 'Em Execução';
      case 'concluida': return 'Concluída';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baixa': return 'bg-green-100 text-green-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'alta': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRegionalName = (regionalId: string) => {
    const regionais = {
      '1': 'Centro-Sul',
      '2': 'Norte',
      '3': 'Leste',
      '4': 'Oeste',
    };
    return regionais[regionalId as keyof typeof regionais] || 'Desconhecida';
  };

  const filteredOcorrencias = ocorrencias.filter(ocorrencia => {
    const matchesSearch = ocorrencia.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ocorrencia.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Aplicar filtros de permissão
    if (user?.role === 'regional') {
      return matchesSearch && ocorrencia.regional_id === user.regional_id;
    }
    if (user?.role === 'empresa') {
      return matchesSearch && ocorrencia.empresa_id === '1'; // Mock empresa ID
    }
    
    // Aplicar filtro de regional para CEGOR
    if (filters.regional && filters.regional !== 'todas') {
      return matchesSearch && ocorrencia.regional_id === filters.regional;
    }
    
    return matchesSearch;
  });

  const exportToCSV = () => {
    const headers = ['Protocolo', 'Descrição', 'Tipo', 'Status', 'Prioridade', 'Regional', 'Data Criação', 'Data Conclusão'];
    const csvContent = [
      headers.join(','),
      ...filteredOcorrencias.map(ocorrencia => [
        ocorrencia.protocol,
        ocorrencia.description,
        ocorrencia.service_type,
        getStatusLabel(ocorrencia.status),
        ocorrencia.priority,
        getRegionalName(ocorrencia.regional_id),
        new Date(ocorrencia.created_at).toLocaleDateString('pt-BR'),
        ocorrencia.completed_at ? new Date(ocorrencia.completed_at).toLocaleDateString('pt-BR') : '-'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'historico_ocorrencias.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <History className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Histórico de Ocorrências</h1>
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="search">Busca Global</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Protocolo ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todos</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                  <SelectItem value="em_execucao">Em Execução</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={filters.tipo} onValueChange={(value) => setFilters({...filters, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todos</SelectItem>
                  <SelectItem value="Limpeza">Limpeza</SelectItem>
                  <SelectItem value="Manutenção">Manutenção</SelectItem>
                  <SelectItem value="Conservação">Conservação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Regional - apenas para CEGOR */}
            {user?.role === 'cegor' && (
              <div>
                <Label htmlFor="regional">Regional</Label>
                <Select value={filters.regional} onValueChange={(value) => setFilters({...filters, regional: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="1">Centro-Sul</SelectItem>
                    <SelectItem value="2">Norte</SelectItem>
                    <SelectItem value="3">Leste</SelectItem>
                    <SelectItem value="4">Oeste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select value={filters.prioridade} onValueChange={(value) => setFilters({...filters, prioridade: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <Card>
        <CardHeader>
          <CardTitle>Histórico ({filteredOcorrencias.length} registros)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Protocolo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                {user?.role === 'cegor' && <TableHead>Regional</TableHead>}
                <TableHead>Data Criação</TableHead>
                <TableHead>Data Conclusão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOcorrencias.map((ocorrencia) => (
                <TableRow key={ocorrencia.id}>
                  <TableCell className="font-medium">{ocorrencia.protocol}</TableCell>
                  <TableCell>{ocorrencia.description}</TableCell>
                  <TableCell>{ocorrencia.service_type}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ocorrencia.status)}>
                      {getStatusLabel(ocorrencia.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(ocorrencia.priority)}>
                      {ocorrencia.priority}
                    </Badge>
                  </TableCell>
                  {user?.role === 'cegor' && (
                    <TableCell>
                      <Badge variant="outline">
                        {getRegionalName(ocorrencia.regional_id)}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell>
                    {new Date(ocorrencia.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {ocorrencia.completed_at 
                      ? new Date(ocorrencia.completed_at).toLocaleDateString('pt-BR')
                      : '-'
                    }
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
