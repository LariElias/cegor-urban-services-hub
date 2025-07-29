import React, { useState } from 'react';
import { Plus, Search, LayoutGrid, List, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useAuth } from '@/context/AuthContext';
import { Ocorrencia, getPermittedActions } from '@/types';
import { getActionButton } from '@/utils/actionButtons';
import { Link } from 'react-router-dom';
import OcorrenciaViewer from '@/components/ocorrencias/OcorrenciaViewer';

const regionalMap: { [key: string]: string } = {
  '1': 'Regional 1',
  '2': 'Regional 2',
  '3': 'Regional 3',
  '4': 'Regional 4',
  '5': 'Regional 5',
  '6': 'Regional 6',
  '7': 'Regional 7',
  '8': 'Regional 8',
  '9': 'Regional 9',
  '10': 'Regional 10',
  '11': 'Regional 11',
  '12': 'Regional 12',
};

// Mock data atualizado com public_equipment_name
const mockOcorrencias: Ocorrencia[] = [
{
  id: '1', protocol: 'OCR-2024-009', description: 'Substituição de bancos quebrados', service_type: 'Manutenção',
  priority: 'media', status: 'criada', address: 'Av. José Bastos, 789', public_equipment_name: 'Praça José de Alencar',
  regional_id: '2', fiscal_id: '2', origin: 'REG2',
  created_at: '2025-07-23T09:30:00Z', updated_at: '2025-07-23T09:30:00Z',
  bairro: 'Parangaba', regionalAn: regionalMap['2']
},
{
  id: '10', protocol: 'OCR-2024-010', description: 'Verificação de esgoto a céu aberto', service_type: 'Saneamento',
  priority: 'alta', status: 'executada', address: 'Rua Eduardo Perdigão, 321', public_equipment_name: 'Canal do Lagamar',
  regional_id: '5', fiscal_id: '5', origin: 'SIGEP',
  vistoria_previa_date: '2025-07-22T08:00:00Z',
  created_at: '2025-07-22T07:30:00Z', updated_at: '2025-07-22T08:30:00Z',
  bairro: 'São João do Tauape', regionalAn: regionalMap['5']
},
{
  id: '11', protocol: 'OCR-2024-011', description: 'Conserto de lixeira danificada', service_type: 'Limpeza',
  priority: 'baixa', status: 'encaminhada', address: 'Rua Padre Pedro de Alencar, 65', public_equipment_name: 'Praça do Lago Jacarey',
  regional_id: '6', fiscal_id: '6', origin: 'REG6',
  forwarded_by: '6', forwarded_at: '2025-07-21T14:00:00Z', created_at: '2025-07-21T12:00:00Z', updated_at: '2025-07-21T14:00:00Z',
  bairro: 'Cidade dos Funcionários', regionalAn: regionalMap['6']
},
{
  id: '12', protocol: 'OCR-2024-012', description: 'Reforma de muro de escola', service_type: 'Reparo',
  priority: 'alta', status: 'autorizada', address: 'Rua Júlio César, 88', public_equipment_name: 'E.M. Antônio Sales',
  regional_id: '3', fiscal_id: '3', origin: 'SPU',
  approved_by_regional: '3', approved_at_regional: '2025-07-20T13:00:00Z', vistoria_previa_date: '2025-07-20T10:00:00Z',
  created_at: '2025-07-20T08:00:00Z', updated_at: '2025-07-20T13:00:00Z',
  bairro: 'Montese', regionalAn: regionalMap['3']
},
{
  id: '13', protocol: 'OCR-2024-013', description: 'Verificação de alagamento', service_type: 'Saneamento',
  priority: 'media', status: 'agendada', address: 'Rua dos Remédios, 12', public_equipment_name: 'Boca de lobo próxima ao mercado',
  regional_id: '1', fiscal_id: '1', origin: 'SIGEP',
  vistoria_previa_date: '2025-07-19T11:00:00Z',
  created_at: '2025-07-19T10:00:00Z', updated_at: '2025-07-19T11:30:00Z',
  bairro: 'Centro', regionalAn: regionalMap['1']
},
{
  id: '14', protocol: 'OCR-2024-014', description: 'Pintura de meio-fio', service_type: 'Pintura',
  priority: 'baixa', status: 'executada', address: 'Av. Rogaciano Leite, 99', public_equipment_name: 'Rotatória do Cambeba',
  regional_id: '6', fiscal_id: '6', origin: 'REG6',
  scheduled_date: '2025-07-18T07:00:00Z', vistoria_previa_date: '2025-07-17T08:00:00Z', vistoria_pos_date: '2025-07-18T18:00:00Z',
  created_at: '2025-07-17T09:00:00Z', updated_at: '2025-07-18T18:30:00Z',
  bairro: 'Cambeba', regionalAn: regionalMap['6']
},
{
  id: '15', protocol: 'OCR-2024-015', description: 'Remoção de entulho', service_type: 'Limpeza',
  priority: 'alta', status: 'criada', address: 'Rua Holanda, 172', public_equipment_name: 'Mercado dos Pinhões',
  regional_id: '1', fiscal_id: '1', origin: 'REG1',
  created_at: '2025-07-23T08:00:00Z', updated_at: '2025-07-23T08:00:00Z',
  bairro: 'Centro', regionalAn: regionalMap['1']
},
{
  id: '16', protocol: 'OCR-2024-016', description: 'Substituição de placa de trânsito', service_type: 'Sinalização',
  priority: 'media', status: 'agendada', address: 'Av. Pontes Vieira, 400', public_equipment_name: 'Cruzamento com Rua Tibúrcio Cavalcante',
  regional_id: '2', fiscal_id: '2', origin: 'SPU',
  scheduled_date: '2025-07-29T10:00:00Z', created_at: '2025-07-27T14:00:00Z', updated_at: '2025-07-28T09:00:00Z',
  bairro: 'Dionísio Torres', regionalAn: regionalMap['2']
},
{
  id: '17', protocol: 'OCR-2024-017', description: 'Reparo de alambrado de quadra', service_type: 'Reparo',
  priority: 'alta', status: 'em_execucao', address: 'Rua Dr. José Lourenço, 50', public_equipment_name: 'Quadra da Praça Luíza Távora',
  regional_id: '1', fiscal_id: '1', origin: 'REG1',
  scheduled_date: '2025-07-26T09:00:00Z', vistoria_previa_date: '2025-07-24T10:00:00Z',
  created_at: '2025-07-24T11:00:00Z', updated_at: '2025-07-26T09:30:00Z',
  bairro: 'Aldeota', regionalAn: regionalMap['1']
},
{
  id: '18', protocol: 'OCR-2024-018', description: 'Limpeza de canaleta de drenagem', service_type: 'Saneamento',
  priority: 'media', status: 'autorizada', address: 'Rua Augusto dos Anjos, 28', public_equipment_name: 'Canal do Conjunto Ceará',
  regional_id: '4', fiscal_id: '4', origin: 'REG4',
  approved_by_regional: '4', approved_at_regional: '2025-07-20T12:00:00Z', vistoria_previa_date: '2025-07-19T09:00:00Z',
  created_at: '2025-07-19T08:00:00Z', updated_at: '2025-07-20T12:30:00Z',
  bairro: 'Conjunto Ceará', regionalAn: regionalMap['4']
},
{
  id: '19', protocol: 'OCR-2024-019', description: 'Pintura de faixa de pedestre', service_type: 'Sinalização',
  priority: 'alta', status: 'executada', address: 'Av. Abolição, 1800', public_equipment_name: 'Faixa em frente ao Ideal Clube',
  regional_id: '2', fiscal_id: '2', origin: 'SIGEP',
  scheduled_date: '2025-07-15T23:00:00Z', vistoria_previa_date: '2025-07-14T10:00:00Z', vistoria_pos_date: '2025-07-16T02:00:00Z',
  created_at: '2025-07-14T09:00:00Z', updated_at: '2025-07-16T02:30:00Z',
  bairro: 'Meireles', regionalAn: regionalMap['2']
},
{
  id: '20', protocol: 'OCR-2024-020', description: 'Instalação de novos brinquedos', service_type: 'Equipamentos',
  priority: 'baixa', status: 'criada', address: 'Rua dos Tabajaras, 75', public_equipment_name: 'Praça da Estação',
  regional_id: '1', fiscal_id: '1', origin: 'REG1',
  created_at: '2025-07-28T10:00:00Z', updated_at: '2025-07-28T10:00:00Z',
  bairro: 'Centro', regionalAn: regionalMap['1']
}

];

const mockEmpresas = [
    { id: '1', name: 'Empresa A de Serviços' },
    { id: '2', name: 'Empresa B de Manutenção' },
    { id: '3', name: 'Empresa C de Limpeza' },
];

const getStatusColor = (status: string) => ({'criada': 'bg-gray-100 text-gray-800','encaminhada': 'bg-blue-100 text-blue-800','autorizada': 'bg-teal-100 text-teal-800','cancelada': 'bg-red-100 text-red-800','devolvida': 'bg-orange-100 text-orange-800','em_analise': 'bg-yellow-100 text-yellow-800','agendada': 'bg-purple-100 text-purple-800','em_execucao': 'bg-cyan-100 text-cyan-800','executada': 'bg-green-100 text-green-800', 'concluida': 'bg-emerald-100 text-emerald-800'}[status] || 'bg-gray-100 text-gray-800');
const getStatusLabel = (status: string) => ({'criada': 'Criada','encaminhada': 'Encaminhada','autorizada': 'Autorizada','cancelada': 'Cancelada','devolvida': 'Devolvida','em_analise': 'Em Análise','agendada': 'Agendada','em_execucao': 'Em Execução','executada': 'Executada', 'concluida': 'Concluída'}[status] || status);
const getPriorityColor = (priority: string) => ({'baixa': 'bg-green-100 text-green-800','media': 'bg-yellow-100 text-yellow-800','alta': 'bg-red-100 text-red-800'}[priority] || 'bg-gray-100 text-gray-800');
const uniqueEquipamentos = [...new Set(mockOcorrencias.map(o => o.public_equipment_name).filter(Boolean))];

// --- Componentes de Visualização ---

const ListView = ({ ocorrencias, renderActionButtons }) => (
  <Card>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Protocolo</TableHead>
          <TableHead>Origem</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Prioridade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Bairro</TableHead>
          <TableHead>Criada</TableHead>
          <TableHead>Agendamento</TableHead>
          <TableHead>Vist. Final</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ocorrencias.map((ocorrencia) => (
          <TableRow key={ocorrencia.id}>
            <TableCell className="font-medium">{ocorrencia.protocol}</TableCell>
            <TableCell>{ocorrencia.origin}</TableCell>
            <TableCell>{ocorrencia.description}</TableCell>
            <TableCell><Badge className={getPriorityColor(ocorrencia.priority)}>{ocorrencia.priority}</Badge></TableCell>
            <TableCell><Badge className={getStatusColor(ocorrencia.status)}>{getStatusLabel(ocorrencia.status)}</Badge></TableCell>
            <TableCell>{ocorrencia.bairro}</TableCell>
            <TableCell>
              {ocorrencia.created_at 
                ? new Date(ocorrencia.created_at).toLocaleDateString('pt-BR')
                : '-'}
            </TableCell>
            <TableCell>
              {ocorrencia.scheduled_date 
                ? new Date(ocorrencia.scheduled_date).toLocaleDateString('pt-BR')
                : '-'}
            </TableCell>
            <TableCell>
              {ocorrencia.approved_at_regional 
                ? new Date(ocorrencia.approved_at_regional).toLocaleDateString('pt-BR')
                : '-'}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                {renderActionButtons(ocorrencia)}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
);

const GridView = ({ ocorrencias, renderActionButtons }) => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ocorrencias.map((ocorrencia) => (
            <Card key={ocorrencia.id} className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{ocorrencia.protocol}</CardTitle>
                        <Badge className={getPriorityColor(ocorrencia.priority)}>{ocorrencia.priority}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{ocorrencia.service_type}</p>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                    <p className="text-sm text-gray-600">{ocorrencia.description}</p>
                    <p className="text-sm text-gray-600"><strong>Equipamento:</strong> {ocorrencia.public_equipment_name}</p>
                    <p className="text-sm text-gray-600"><strong>Endereço:</strong> {ocorrencia.address}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Status:</span>
                        <Badge className={getStatusColor(ocorrencia.status)}>{getStatusLabel(ocorrencia.status)}</Badge>
                    </div>
                    <div className="space-y-2 text-xs text-gray-500">
                        <p><strong>Criação:</strong> {new Date(ocorrencia.created_at).toLocaleDateString('pt-BR')}</p>
                        {ocorrencia.vistoria_previa_date && (
                            <p><strong>Vistoria Prévia:</strong> {new Date(ocorrencia.vistoria_previa_date).toLocaleDateString('pt-BR')}</p>
                        )}
                        {ocorrencia.scheduled_date && (
                            <p><strong>Agendamento:</strong> {new Date(ocorrencia.scheduled_date).toLocaleDateString('pt-BR')}</p>
                        )}
                        {ocorrencia.vistoria_pos_date && (
                            <p><strong>Vistoria Pós:</strong> {new Date(ocorrencia.vistoria_pos_date).toLocaleDateString('pt-BR')}</p>
                        )}
                    </div>
                </CardContent>
                <div className="flex items-center justify-end gap-2 p-4 pt-2 border-t mt-auto">
                    {renderActionButtons(ocorrencia)}
                </div>
            </Card>
        ))}
    </div>
);

export default function ListaOcorrencias() {
  const { user } = useAuth();
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>(mockOcorrencias);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedEquipamento, setSelectedEquipamento] = useState('');
  const [scheduledDateFilter, setScheduledDateFilter] = useState('');
  
  // Estados para UI e Dialogs
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelReason, setCancelReason] = useState('');
  const [schedulingOcorrencia, setSchedulingOcorrencia] = useState<Ocorrencia | null>(null);
  const [newScheduleDate, setNewScheduleDate] = useState('');
  const [responsibleCompany, setResponsibleCompany] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [cancelingOcorrenciaId, setCancelingOcorrenciaId] = useState<string | null>(null);
  const [viewingOcorrencia, setViewingOcorrencia] = useState<Ocorrencia | null>(null);
  const itemsPerPage = 5;

  // --- Lógica de Ações e Status ---
  const handleStatusChange = (id: string, newStatus: Ocorrencia['status'], additionalData?: any) => {
    setOcorrencias(ocorrencias.map(o => o.id === id ? { ...o, status: newStatus, updated_at: new Date().toISOString(), ...additionalData } : o));
  };

  const handleAction = (action: string, ocorrenciaId: string) => {
    switch (action) {
      case 'visualizar':
        const ocorrencia = ocorrencias.find(o => o.id === ocorrenciaId);
        if (ocorrencia) {
          setViewingOcorrencia(ocorrencia);
        }
        break;
      case 'permitir_execucao':
        handleStatusChange(ocorrenciaId, 'autorizada', { approved_by_regional: user?.id, approved_at_regional: new Date().toISOString() });
        break;
      case 'encaminhar':
        handleStatusChange(ocorrenciaId, 'encaminhada', { forwarded_by: user?.id, forwarded_at: new Date().toISOString() });
        break;
      case 'agendar_ocorrencia':
        const ocorrenciaToSchedule = ocorrencias.find(o => o.id === ocorrenciaId);
        if (ocorrenciaToSchedule) {
          setSchedulingOcorrencia(ocorrenciaToSchedule);
        }
        break;
      default:
        console.log(`Ação ${action} para ocorrência ${ocorrenciaId}`);
    }
  };

  const handleSchedule = () => {
    if (!schedulingOcorrencia || !newScheduleDate || !scheduleTime) { 
      alert('A data e o horário do agendamento são obrigatórios.'); 
      return; 
    }
    handleStatusChange(schedulingOcorrencia.id, 'agendada', { scheduled_date: new Date(newScheduleDate).toISOString() });
    setSchedulingOcorrencia(null);
    setNewScheduleDate('');
    setResponsibleCompany('');
    setTeamSize('');
    setScheduleTime('');
  };

  // --- Lógica de Filtragem ---
  const filteredOcorrencias = ocorrencias.filter(ocorrencia => {
    // Filtro geral por regional
    if (user?.role === 'regional' && ocorrencia.regional_id !== user.regional_id) {
        return false;
    }
    // Filtro específico de status para empresa
    if (user?.role === 'empresa' && !['autorizada', 'agendada', 'em_execucao', 'executada'].includes(ocorrencia.status)) {
        return false;
    }

    const matchesSearch = ocorrencia.protocol.toLowerCase().includes(searchTerm.toLowerCase()) || ocorrencia.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || ocorrencia.status === selectedStatus;
    const matchesPriority = !selectedPriority || ocorrencia.priority === selectedPriority;
    const matchesEquipamento = !selectedEquipamento || ocorrencia.public_equipment_name === selectedEquipamento;
    const matchesDate = !scheduledDateFilter || (ocorrencia.scheduled_date && ocorrencia.scheduled_date.startsWith(scheduledDateFilter));
    
    return matchesSearch && matchesStatus && matchesPriority && matchesEquipamento && matchesDate;
  });

  // --- Lógica de Paginação ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListItems = filteredOcorrencias.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOcorrencias.length / itemsPerPage);

  // --- Renderização de Botões baseada em Permissões ---
  const renderActionButtons = (ocorrencia: Ocorrencia) => {
    if (!user) return [];

    const permittedActions = getPermittedActions(user.role, user.subrole);
    
    return permittedActions.map(action => 
      getActionButton(action, ocorrencia.id, (id) => handleAction(action, id))
    ).filter(Boolean);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ocorrências</h1>
        {/* <Button asChild>
          <Link to="/ocorrencias/nova">
            <Plus className="w-4 h-4 mr-2" />Nova Ocorrência
          </Link>
        </Button> */}
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Search className="w-4 h-4" /> Filtros</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input placeholder="Buscar protocolo ou descrição..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="lg:col-span-2" />
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="h-10 px-3 rounded-md border border-input bg-background text-sm">
            <option value="">Todos os Status</option>
            {['criada', 'encaminhada', 'autorizada', 'agendada', 'em_execucao', 'executada', 'concluida', 'cancelada', 'devolvida'].map(s => 
              <option key={s} value={s}>{getStatusLabel(s)}</option>
            )}
          </select>
          <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} className="h-10 px-3 rounded-md border border-input bg-background text-sm">
            <option value="">Todas as Prioridades</option>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
          <select value={selectedEquipamento} onChange={(e) => setSelectedEquipamento(e.target.value)} className="h-10 px-3 rounded-md border border-input bg-background text-sm">
            <option value="">Todos Equipamentos</option>
            {uniqueEquipamentos.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <Input type="date" value={scheduledDateFilter} onChange={(e) => setScheduledDateFilter(e.target.value)} className="h-10 px-3 rounded-md border border-input bg-background text-sm" />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{filteredOcorrencias.length} ocorrências encontradas</p>
        <div className="flex items-center justify-end gap-2 p-1 bg-gray-100 rounded-lg">
          <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div>
        {filteredOcorrencias.length > 0 ? (
          viewMode === 'grid' ? (
            <GridView ocorrencias={filteredOcorrencias} renderActionButtons={renderActionButtons} />
          ) : (
            <div className="space-y-4">
              <ListView ocorrencias={currentListItems} renderActionButtons={renderActionButtons} />
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(p - 1, 1)); }} 
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined} 
                      />
                    </PaginationItem>
                    {[...Array(totalPages).keys()].map(num => (
                      <PaginationItem key={num + 1}>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); setCurrentPage(num + 1); }} 
                          isActive={currentPage === num + 1}
                        >
                          {num + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(p + 1, totalPages)); }} 
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined} 
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhuma ocorrência encontrada.</p>
          </div>
        )}
      </div>

      <Dialog open={!!schedulingOcorrencia} onOpenChange={(isOpen) => !isOpen && setSchedulingOcorrencia(null)}>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader><DialogTitle>Agendamento da Ocorrência</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
                <p className="text-sm text-gray-600">Agendar execução para a ocorrência <strong>{schedulingOcorrencia?.protocol}</strong>.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="space-y-2">
                        <Label>Tipo de Ocorrência:</Label>
                        <Input value={schedulingOcorrencia?.service_type || ''} disabled className="bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="responsible-company">Empresa Responsável:</Label>
                        <select id="responsible-company" value={responsibleCompany} onChange={(e) => setResponsibleCompany(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="">Selecione uma empresa</option>
                            {mockEmpresas.map(empresa => (
                                <option key={empresa.id} value={empresa.id}>{empresa.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="team-size">Quantidade de Pessoas na Equipe:</Label>
                        <Input id="team-size" type="number" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label>Descrição:</Label>
                        <Textarea value={schedulingOcorrencia?.description || ''} disabled rows={2} className="bg-gray-100" />
                    </div>
                    <hr className="md:col-span-2 my-2"/>
                    <div className="space-y-2">
                        <Label htmlFor="schedule-date">Data disponível:</Label>
                        <Input id="schedule-date" type="date" value={newScheduleDate} onChange={(e) => setNewScheduleDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="schedule-time">Horários disponíveis:</Label>
                        <select id="schedule-time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="">Selecione um horário</option>
                            <option value="07h-12h">07h - 12h</option>
                            <option value="13h-17h">13h - 17h</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setSchedulingOcorrencia(null)}>Cancelar</Button>
                    <Button onClick={handleSchedule} className="bg-blue-600 hover:bg-blue-700">Confirmar Agendamento</Button>
                </div>
            </div>
        </DialogContent>
      </Dialog>

      {viewingOcorrencia && (
        <OcorrenciaViewer
          ocorrencia={viewingOcorrencia}
          isOpen={!!viewingOcorrencia}
          onClose={() => setViewingOcorrencia(null)}
        />
      )}
    </div>
  );
}
