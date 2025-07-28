
import React, { useState } from 'react';
import { Calendar, FileText, Search, Filter, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ocorrencia } from '@/types';

// Mock data com public_equipment_name
const mockHistoricoOcorrencias: Ocorrencia[] = [
  {
    id: '1',
    protocol: 'OCR-2024-001',
    description: 'Limpeza de terreno baldio',
    service_type: 'Limpeza',
    public_equipment_name: 'Praça Central',
    priority: 'alta',
    status: 'concluida',
    address: 'Rua das Flores, 123',
    regional_id: '1',
    fiscal_id: '1',
    completed_at: '2024-01-15T14:30:00Z',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    protocol: 'OCR-2024-002',
    description: 'Reparo em calçada',
    service_type: 'Manutenção',
    public_equipment_name: 'Escola Municipal',
    priority: 'media',
    status: 'cancelada',
    address: 'Av. Beira Mar, 456',
    regional_id: '2',
    fiscal_id: '2',
    cancel_reason: 'Falta de material',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-14T16:00:00Z'
  },
  {
    id: '3',
    protocol: 'OCR-2024-003',
    description: 'Poda de árvores',
    service_type: 'Conservação',
    public_equipment_name: 'Parque Municipal',
    priority: 'baixa',
    status: 'concluida',
    address: 'Rua Verde, 789',
    regional_id: '3',
    fiscal_id: '3',
    completed_at: '2024-01-20T11:45:00Z',
    created_at: '2024-01-18T08:30:00Z',
    updated_at: '2024-01-20T11:45:00Z'
  }
];

const getStatusColor = (status: string) => {
  const colors = {
    'criada': 'bg-gray-100 text-gray-800',
    'encaminhada': 'bg-blue-100 text-blue-800',
    'autorizada': 'bg-teal-100 text-teal-800',
    'cancelada': 'bg-red-100 text-red-800',
    'devolvida': 'bg-orange-100 text-orange-800',
    'em_analise': 'bg-yellow-100 text-yellow-800',
    'agendada': 'bg-purple-100 text-purple-800',
    'em_execucao': 'bg-cyan-100 text-cyan-800',
    'executada': 'bg-green-100 text-green-800',
    'concluida': 'bg-emerald-100 text-emerald-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getStatusLabel = (status: string) => {
  const labels = {
    'criada': 'Criada',
    'encaminhada': 'Encaminhada',
    'autorizada': 'Autorizada',
    'cancelada': 'Cancelada',
    'devolvida': 'Devolvida',
    'em_analise': 'Em Análise',
    'agendada': 'Agendada',
    'em_execucao': 'Em Execução',
    'executada': 'Executada',
    'concluida': 'Concluída'
  };
  return labels[status] || status;
};

const getPriorityColor = (priority: string) => {
  const colors = {
    'baixa': 'bg-green-100 text-green-800',
    'media': 'bg-yellow-100 text-yellow-800',
    'alta': 'bg-red-100 text-red-800'
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
};

export default function HistoricoOcorrencias() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredOcorrencias = mockHistoricoOcorrencias.filter(ocorrencia => {
    const matchesSearch = ocorrencia.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ocorrencia.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || ocorrencia.status === selectedStatus;
    const matchesPriority = !selectedPriority || ocorrencia.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleExport = () => {
    console.log('Exportando dados do histórico...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Histórico de Ocorrências</h1>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Buscar</label>
            <Input
              placeholder="Protocolo ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
                <SelectItem value="executada">Executada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Prioridade</label>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as prioridades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as prioridades</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="flex-1"
              />
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Ocorrências ({filteredOcorrencias.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Protocolo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Equipamento</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criação</TableHead>
                <TableHead>Conclusão</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOcorrencias.map((ocorrencia) => (
                <TableRow key={ocorrencia.id}>
                  <TableCell className="font-medium">{ocorrencia.protocol}</TableCell>
                  <TableCell>{ocorrencia.description}</TableCell>
                  <TableCell>{ocorrencia.public_equipment_name}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(ocorrencia.priority)}>
                      {ocorrencia.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ocorrencia.status)}>
                      {getStatusLabel(ocorrencia.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(ocorrencia.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {ocorrencia.completed_at 
                      ? new Date(ocorrencia.completed_at).toLocaleDateString('pt-BR')
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
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
