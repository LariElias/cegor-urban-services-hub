
import React, { useState } from 'react';
import { Eye, Calendar, Clock, User, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { Ocorrencia } from '@/types';
import { getPermittedActions } from '@/types';
import { getActionButton } from '@/utils/actionButtons';
import OcorrenciaViewer from '@/components/ocorrencias/OcorrenciaViewer';

const ListaOcorrencias = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedOcorrencia, setSelectedOcorrencia] = useState<Ocorrencia | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const mockOcorrencias: Ocorrencia[] = [
    {
      id: '1',
      protocol: 'OCR-2024-001',
      description: 'Limpeza de bueiro obstruído na Rua Principal',
      service_type: 'Limpeza',
      public_equipment_name: 'Bueiro Principal - Rua A',
      priority: 'alta',
      status: 'em_execucao',
      address: 'Rua Principal, 123',
      regional_id: '1',
      fiscal_id: '1',
      created_at: '2024-01-10T08:00:00Z',
      updated_at: '2024-01-15T14:30:00Z',
      vistoria_previa_date: '2024-01-12T09:00:00Z',
      scheduled_date: '2024-01-15T14:00:00Z',
      started_at: '2024-01-15T14:00:00Z',
      empresa_id: '1',
      equipe_id: '1'
    },
    {
      id: '2',
      protocol: 'OCR-2024-002',
      description: 'Reparo de luminária pública',
      service_type: 'Elétrica',
      public_equipment_name: 'Poste 456 - Av. Central',
      priority: 'media',
      status: 'agendada',
      address: 'Avenida Central, 456',
      regional_id: '1',
      fiscal_id: '2',
      created_at: '2024-01-12T09:15:00Z',
      updated_at: '2024-01-13T16:45:00Z',
      vistoria_previa_date: '2024-01-13T10:00:00Z',
      scheduled_date: '2024-01-16T08:00:00Z',
      empresa_id: '2',
      equipe_id: '2'
    },
    {
      id: '3',
      protocol: 'OCR-2024-003',
      description: 'Manutenção de equipamento de praça',
      service_type: 'Paisagismo',
      public_equipment_name: 'Praça da Liberdade',
      priority: 'baixa',
      status: 'concluida',
      address: 'Praça da Liberdade, s/n',
      regional_id: '2',
      fiscal_id: '3',
      created_at: '2024-01-08T10:30:00Z',
      updated_at: '2024-01-20T17:00:00Z',
      vistoria_previa_date: '2024-01-09T14:00:00Z',
      scheduled_date: '2024-01-18T09:00:00Z',
      started_at: '2024-01-18T09:00:00Z',
      completed_at: '2024-01-20T17:00:00Z',
      vistoria_pos_date: '2024-01-20T16:00:00Z',
      empresa_id: '1',
      equipe_id: '3'
    }
  ];

  const filteredOcorrencias = mockOcorrencias.filter(ocorrencia => {
    const matchesSearch = ocorrencia.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ocorrencia.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ocorrencia.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ocorrencia.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => ({
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
  }[status] || 'bg-gray-100 text-gray-800');

  const getStatusLabel = (status: string) => ({
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
  }[status] || status);

  const getPriorityColor = (priority: string) => ({
    'baixa': 'bg-green-100 text-green-800',
    'media': 'bg-yellow-100 text-yellow-800',
    'alta': 'bg-red-100 text-red-800'
  }[priority] || 'bg-gray-100 text-gray-800');

  const handleAction = (action: string, ocorrenciaId: string) => {
    const ocorrencia = mockOcorrencias.find(o => o.id === ocorrenciaId);
    
    if (action === 'visualizar' && ocorrencia) {
      setSelectedOcorrencia(ocorrencia);
      setIsViewerOpen(true);
    } else {
      console.log(`Ação ${action} executada para ocorrência ${ocorrenciaId}`);
    }
  };

  const renderActionButtons = (ocorrencia: Ocorrencia) => {
    if (!user) return [];

    const permittedActions = getPermittedActions(user.role, user.subrole);
    
    return permittedActions.map(action => 
      getActionButton(action, ocorrencia.id, (id) => handleAction(action, id))
    ).filter(Boolean);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const ListView = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Protocolo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Equip. Público</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criação</TableHead>
            <TableHead className="hidden md:table-cell">Vistoria Prévia</TableHead>
            <TableHead className="hidden lg:table-cell">Agendamento Exec.</TableHead>
            <TableHead className="hidden lg:table-cell">Vistoria Pós</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOcorrencias.map((ocorrencia) => (
            <TableRow key={ocorrencia.id}>
              <TableCell className="font-mono text-sm">{ocorrencia.protocol}</TableCell>
              <TableCell className="max-w-xs truncate">{ocorrencia.description}</TableCell>
              <TableCell className="max-w-xs truncate">{ocorrencia.public_equipment_name}</TableCell>
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
              <TableCell>{formatDate(ocorrencia.created_at)}</TableCell>
              <TableCell className="hidden md:table-cell">{formatDate(ocorrencia.vistoria_previa_date)}</TableCell>
              <TableCell className="hidden lg:table-cell">{formatDate(ocorrencia.scheduled_date)}</TableCell>
              <TableCell className="hidden lg:table-cell">{formatDate(ocorrencia.vistoria_pos_date)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  {renderActionButtons(ocorrencia)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredOcorrencias.map((ocorrencia) => (
        <Card key={ocorrencia.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{ocorrencia.protocol}</CardTitle>
              <div className="flex gap-2">
                <Badge className={getPriorityColor(ocorrencia.priority)}>
                  {ocorrencia.priority}
                </Badge>
                <Badge className={getStatusColor(ocorrencia.status)}>
                  {getStatusLabel(ocorrencia.status)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Descrição</p>
                <p className="text-sm">{ocorrencia.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Equipamento Público</p>
                <p className="text-sm">{ocorrencia.public_equipment_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="font-medium text-gray-500">Criação</p>
                  <p>{formatDate(ocorrencia.created_at)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Vistoria Prévia</p>
                  <p>{formatDate(ocorrencia.vistoria_previa_date)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Agendamento</p>
                  <p>{formatDate(ocorrencia.scheduled_date)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Vistoria Pós</p>
                  <p>{formatDate(ocorrencia.vistoria_pos_date)}</p>
                </div>
              </div>
              <div className="flex justify-end gap-1 pt-2">
                {renderActionButtons(ocorrencia)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lista de Ocorrências</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Ocorrência
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por protocolo ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="criada">Criada</SelectItem>
                <SelectItem value="encaminhada">Encaminhada</SelectItem>
                <SelectItem value="autorizada">Autorizada</SelectItem>
                <SelectItem value="agendada">Agendada</SelectItem>
                <SelectItem value="em_execucao">Em Execução</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Prioridades</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className="flex-1"
              >
                Lista
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                className="flex-1"
              >
                Cards
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'list' ? <ListView /> : <GridView />}

      {selectedOcorrencia && (
        <OcorrenciaViewer
          ocorrencia={selectedOcorrencia}
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedOcorrencia(null);
          }}
        />
      )}
    </div>
  );
};

export default ListaOcorrencias;
