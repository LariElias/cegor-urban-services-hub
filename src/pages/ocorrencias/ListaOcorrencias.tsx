import React, { useState } from 'react';
import { Plus, Edit, Eye, Play, Send, CheckCircle, XCircle, Camera, FileText, Search, Check, X, Building, LayoutGrid, List, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useAuth } from '@/context/AuthContext';
import { Ocorrencia, isRegionalGestor, isRegionalOperador, isRegionalFiscal } from '@/types';
import { Link } from 'react-router-dom';

// Mock data com status 'executada' para teste do fiscal
const mockOcorrencias: Ocorrencia[] = [
  {
    id: '1', protocol: 'OCR-2024-001', description: 'Limpeza de terreno baldio', service_type: 'Limpeza',
    priority: 'alta', status: 'criada', address: 'Rua das Flores, 123', public_equipment_name: 'Praça do Ferreira',
    regional_id: '1', fiscal_id: '1', origin: 'SIGEP',
    vistoria_previa_date: '2025-07-20T08:00:00Z',
    created_at: '2025-07-20T10:00:00Z', updated_at: '2025-07-20T10:00:00Z'
  },
  {
    id: '2', protocol: 'OCR-2024-002', description: 'Reparo em calçada', service_type: 'Manutenção',
    priority: 'media', status: 'encaminhada', address: 'Av. Beira Mar, 456', public_equipment_name: 'Areninha Campo do América',
    regional_id: '2', fiscal_id: '2', origin: 'SPU',
    forwarded_by: '2', forwarded_at: '2025-07-21T11:00:00Z', created_at: '2025-07-21T09:00:00Z', updated_at: '2025-07-21T11:00:00Z'
  },
  {
    id: '3', protocol: 'OCR-2024-003', description: 'Poda de árvores no parque', service_type: 'Conservação',
    priority: 'baixa', status: 'autorizada', address: 'Av. Padre Antônio Tomás, s/n', public_equipment_name: 'Parque do Cocó',
    regional_id: '5', fiscal_id: '5', origin: 'REG2',
    approved_by_regional: '5', approved_at_regional: '2025-07-19T14:00:00Z', vistoria_previa_date: '2025-07-19T12:00:00Z',
    created_at: '2025-07-19T10:00:00Z', updated_at: '2025-07-19T14:00:00Z'
  },
  {
    id: '4', protocol: 'OCR-2024-004', description: 'Vazamento em poste de saúde', service_type: 'Reparo',
    priority: 'alta', status: 'agendada', address: 'Rua G, 300', public_equipment_name: 'Posto de Saúde Dr. Hélio Goes',
    regional_id: '6', fiscal_id: '6', origin: 'SIGEP',
    scheduled_date: '2025-07-25T09:00:00Z', vistoria_previa_date: '2025-07-22T07:00:00Z',
    created_at: '2025-07-22T08:00:00Z', updated_at: '2025-07-22T10:00:00Z'
  },
  {
    id: '5', protocol: 'OCR-2024-005', description: 'Manutenção de brinquedos na praça', service_type: 'Manutenção',
    priority: 'media', status: 'em_execucao', address: 'Rua Paulino Nogueira, s/n', public_equipment_name: 'Praça da Gentilândia',
    regional_id: '1', fiscal_id: '1', origin: 'REG1',
    scheduled_date: '2025-07-20T14:00:00Z', vistoria_previa_date: '2025-07-18T13:00:00Z',
    created_at: '2025-07-18T15:00:00Z', updated_at: '2025-07-20T13:00:00Z'
  },
  {
    id: '6', protocol: 'OCR-2024-006', description: 'Pintura de quadra', service_type: 'Pintura',
    priority: 'baixa', status: 'executada', address: 'Av. Gov. Leonel Brizola, s/n', public_equipment_name: 'Cuca Jangurussu',
    regional_id: '4', fiscal_id: '4', origin: 'SPU',
    scheduled_date: '2025-06-12T08:00:00Z', vistoria_previa_date: '2025-06-10T07:00:00Z', vistoria_pos_date: '2025-06-15T15:00:00Z',
    created_at: '2025-06-10T09:00:00Z', updated_at: '2025-06-15T16:00:00Z'
  },
  {
    id: '7', protocol: 'OCR-2024-007', description: 'Troca de lâmpada queimada', service_type: 'Iluminação',
    priority: 'alta', status: 'criada', address: 'Rua Delmiro de Farias, 1000', public_equipment_name: 'E.E.F.M. Adauto Bezerra',
    regional_id: '3', fiscal_id: '3', origin: 'SPU',
    created_at: '2025-07-22T11:00:00Z', updated_at: '2025-07-22T11:00:00Z'
  },
  {
    id: '8', protocol: 'OCR-2024-008', description: 'Capinação de área externa', service_type: 'Limpeza',
    priority: 'media', status: 'cancelada', address: 'Rua Pernambuco, s/n', public_equipment_name: 'Areninha do Pici',
    regional_id: '3', fiscal_id: '3', origin: 'REG3',
    cancel_reason: 'Serviço já executado por outra equipe.', created_at: '2025-07-15T12:00:00Z', updated_at: '2025-07-16T10:00:00Z'
  },
  {
    id: '9', protocol: 'OCR-2024-009', description: 'Conserto de portão de escola', service_type: 'Serralheria',
    priority: 'alta', status: 'agendada', address: 'Rua I, 150', public_equipment_name: 'E.M.E.I.F. Rachel de Queiroz',
    regional_id: '4', fiscal_id: '4', origin: 'SIGEP',
    scheduled_date: '2025-07-28T14:00:00Z', vistoria_previa_date: '2025-07-21T15:00:00Z',
    created_at: '2025-07-21T16:00:00Z', updated_at: '2025-07-22T09:00:00Z'
  },
  {
    id: '10', protocol: 'OCR-2024-010', description: 'Revisão de estrutura de parquinho', service_type: 'Inspeção',
    priority: 'media', status: 'devolvida', address: 'Rua das Flores, 123', public_equipment_name: 'Praça do Ferreira',
    regional_id: '1', fiscal_id: '1', origin: 'REG4',
    cancel_reason: 'Faltam informações sobre o material necessário.', created_at: '2025-07-20T14:00:00Z', updated_at: '2025-07-21T17:00:00Z'
  },
  {
    id: '11', protocol: 'OCR-2024-011', description: 'Verificação de vazamento de esgoto', service_type: 'Inspeção',
    priority: 'alta', status: 'criada', address: 'Rua Alfa, 999', public_equipment_name: 'Centro Comunitário Alfa',
    regional_id: '2', fiscal_id: '2', origin: 'SIGEP',
    created_at: '2025-07-20T08:00:00Z', updated_at: '2025-07-20T08:00:00Z'
  },
  {
    id: '12', protocol: 'OCR-2024-012', description: 'Reposição de bancos danificados', service_type: 'Manutenção',
    priority: 'media', status: 'criada', address: 'Rua Beta, 88', public_equipment_name: 'Praça do Sol',
    regional_id: '2', fiscal_id: '2', origin: 'REG5',
    created_at: '2025-07-20T10:30:00Z', updated_at: '2025-07-20T10:30:00Z'
  },
  {
    id: '13', protocol: 'OCR-2024-013', description: 'Troca de refletores', service_type: 'Iluminação',
    priority: 'alta', status: 'executada', address: 'Rua Gama, 300', public_equipment_name: 'Campo do Gama',
    regional_id: '6', fiscal_id: '6', origin: 'SPU',
    scheduled_date: '2025-07-11T09:00:00Z', vistoria_previa_date: '2025-07-10T13:00:00Z', vistoria_pos_date: '2025-07-12T14:00:00Z',
    created_at: '2025-07-10T14:00:00Z', updated_at: '2025-07-12T15:00:00Z'
  },
  {
    id: '14', protocol: 'OCR-2024-014', description: 'Ajuste em grades de proteção', service_type: 'Serralheria',
    priority: 'baixa', status: 'em_execucao', address: 'Rua Delta, 200', public_equipment_name: 'Praça Delta',
    regional_id: '5', fiscal_id: '5', origin: 'REG6',
    scheduled_date: '2025-07-20T10:00:00Z', vistoria_previa_date: '2025-07-19T12:00:00Z',
    created_at: '2025-07-19T13:00:00Z', updated_at: '2025-07-20T09:00:00Z'
  },
  {
    id: '15', protocol: 'OCR-2024-015', description: 'Revisão de encanamento público', service_type: 'Manutenção',
    priority: 'alta', status: 'agendada', address: 'Rua Epsilon, 155', public_equipment_name: 'CRAS Epsilon',
    regional_id: '6', fiscal_id: '6', origin: 'SIGEP',
    scheduled_date: '2025-07-25T15:00:00Z', vistoria_previa_date: '2025-07-22T08:00:00Z',
    created_at: '2025-07-22T09:00:00Z', updated_at: '2025-07-22T11:00:00Z'
  },
  {
    id: '16', protocol: 'OCR-2024-016', description: 'Inspeção elétrica', service_type: 'Inspeção',
    priority: 'media', status: 'autorizada', address: 'Rua Zeta, 444', public_equipment_name: 'Ginásio Zeta',
    regional_id: '3', fiscal_id: '3', origin: 'REG7',
    approved_by_regional: '3', approved_at_regional: '2025-07-21T10:00:00Z', vistoria_previa_date: '2025-07-20T11:00:00Z',
    created_at: '2025-07-20T12:00:00Z', updated_at: '2025-07-21T10:00:00Z'
  },
  {
    id: '17', protocol: 'OCR-2024-017', description: 'Manutenção de refletores', service_type: 'Iluminação',
    priority: 'baixa', status: 'criada', address: 'Rua Teta, 777', public_equipment_name: 'Areninha Teta',
    regional_id: '4', fiscal_id: '4', origin: 'SPU',
    created_at: '2025-07-23T08:00:00Z', updated_at: '2025-07-23T08:00:00Z'
  },
  {
    id: '18', protocol: 'OCR-2024-018', description: 'Pintura de meio-fio', service_type: 'Pintura',
    priority: 'media', status: 'executada', address: 'Rua Ômega, 333', public_equipment_name: 'Escola Ômega',
    regional_id: '5', fiscal_id: '5', origin: 'REG8',
    scheduled_date: '2025-07-16T08:00:00Z', vistoria_previa_date: '2025-07-15T06:00:00Z', vistoria_pos_date: '2025-07-18T12:00:00Z',
    created_at: '2025-07-15T07:00:00Z', updated_at: '2025-07-18T13:00:00Z'
  },
  {
    id: '19', protocol: 'OCR-2024-019', description: 'Instalação de lixeiras', service_type: 'Instalação',
    priority: 'baixa', status: 'encaminhada', address: 'Rua Sigma, 222', public_equipment_name: 'Praça Sigma',
    regional_id: '2', fiscal_id: '2', origin: 'SIGEP',
    forwarded_by: '2', forwarded_at: '2025-07-21T14:00:00Z', created_at: '2025-07-21T11:00:00Z', updated_at: '2025-07-21T14:00:00Z'
  },
  {
    id: '20', protocol: 'OCR-2024-020', description: 'Conserto em alambrado', service_type: 'Serralheria',
    priority: 'alta', status: 'criada', address: 'Rua Phi, 789', public_equipment_name: 'Campo do Centro',
    regional_id: '1', fiscal_id: '1', origin: 'REG9',
    created_at: '2025-07-22T08:00:00Z', updated_at: '2025-07-22T08:00:00Z'
  },
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
          <TableHead>Descrição</TableHead>
          <TableHead>Equip. Público</TableHead>
          <TableHead>Prioridade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Criação</TableHead>
          <TableHead>Vistoria Prévia</TableHead>
          <TableHead>Agendamento Exec.</TableHead>
          <TableHead>Vistoria Pós</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ocorrencias.map((ocorrencia) => (
          <TableRow key={ocorrencia.id}>
            <TableCell className="font-medium">{ocorrencia.protocol}</TableCell>
            <TableCell>{ocorrencia.description}</TableCell>
            <TableCell>{ocorrencia.public_equipment_name}</TableCell>
            <TableCell><Badge className={getPriorityColor(ocorrencia.priority)}>{ocorrencia.priority}</Badge></TableCell>
            <TableCell><Badge className={getStatusColor(ocorrencia.status)}>{getStatusLabel(ocorrencia.status)}</Badge></TableCell>
            <TableCell>{new Date(ocorrencia.created_at).toLocaleDateString('pt-BR')}</TableCell>
            <TableCell>
              {ocorrencia.vistoria_previa_date 
                ? new Date(ocorrencia.vistoria_previa_date).toLocaleDateString('pt-BR')
                : '-'}
            </TableCell>
            <TableCell>
              {ocorrencia.scheduled_date 
                ? new Date(ocorrencia.scheduled_date).toLocaleDateString('pt-BR')
                : '-'}
            </TableCell>
            <TableCell>
              {ocorrencia.vistoria_pos_date 
                ? new Date(ocorrencia.vistoria_pos_date).toLocaleDateString('pt-BR')
                : '-'}
            </TableCell>
            <TableCell className="text-right"><div className="flex items-center justify-end gap-2">{renderActionButtons(ocorrencia)}</div></TableCell>
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
  const itemsPerPage = 5;

  // --- Lógica de Ações e Status ---
  const handleStatusChange = (id: string, newStatus: Ocorrencia['status'], additionalData?: any) => {
    setOcorrencias(ocorrencias.map(o => o.id === id ? { ...o, status: newStatus, updated_at: new Date().toISOString(), ...additionalData } : o));
  };
  const handleRegionalApproval = (id: string) => handleStatusChange(id, 'autorizada', { approved_by_regional: user?.id, approved_at_regional: new Date().toISOString() });
  const handleForwardToCegor = (id: string) => handleStatusChange(id, 'encaminhada', { forwarded_by: user?.id, forwarded_at: new Date().toISOString() });
  const handleCegorApproval = (id: string) => handleStatusChange(id, 'autorizada', { approved_by: user?.name, approved_at: new Date().toISOString() });
  
  const handleCancellation = () => {
    if (!cancelingOcorrenciaId || !cancelReason.trim()) { alert('Motivo do cancelamento é obrigatório'); return; }
    handleStatusChange(cancelingOcorrenciaId, 'cancelada', { cancel_reason: cancelReason });
    setCancelReason('');
    setCancelingOcorrenciaId(null);
  };

  const handleSchedule = () => {
    if (!schedulingOcorrencia || !newScheduleDate || !scheduleTime) { alert('A data e o horário do agendamento são obrigatórios.'); return; }
    console.log({ responsibleCompany, teamSize });
    handleStatusChange(schedulingOcorrencia.id, 'agendada', { scheduled_date: new Date(newScheduleDate).toISOString() });
    setSchedulingOcorrencia(null);
    setNewScheduleDate('');
    setResponsibleCompany('');
    setTeamSize('');
    setScheduleTime('');
  };

  const handleFiscalApproval = (id: string) => {
    handleStatusChange(id, 'concluida', { fiscal_approved_by: user?.id, fiscal_approved_at: new Date().toISOString() });
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

  // --- Renderização de Botões ---
  const renderActionButtons = (ocorrencia: Ocorrencia) => {
    const buttons = [];

    buttons.push(<Button key="permitir" variant="outline" size="icon" onClick={() => handleCegorApproval(ocorrencia.id)} title="Permitir Execução" className="text-green-600 hover:text-green-700"><Check className="w-4 h-4" /></Button>);
    buttons.push(<Button key="cancelar" variant="outline" size="icon" onClick={() => setCancelingOcorrenciaId(ocorrencia.id)} title="Cancelar" className="text-red-600 hover:text-red-700"><X className="w-4 h-4" /></Button>);
    buttons.push(<Button key="agendar" variant="outline" size="icon" onClick={() => setSchedulingOcorrencia(ocorrencia)} title="Agendar Ocorrência"><Calendar className="w-4 h-4" /></Button>);
    buttons.push(<Button key="vistoria" variant="outline" size="icon" asChild title="Realizar Vistoria"><Link to={`/ocorrencias/${ocorrencia.id}/vistoria`}><Camera className="w-4 h-4" /></Link></Button>);
    buttons.push(<Button key="acompanhamento" variant="outline" size="icon" asChild title="Acompanhamento"><Link to={`/ocorrencias/${ocorrencia.id}/acompanhamento`}><FileText className="w-4 h-4" /></Link></Button>);
    buttons.push(<Button key="executar-regional" variant="outline" size="icon" onClick={() => handleRegionalApproval(ocorrencia.id)} title="Executar na Regional" className="text-green-600 hover:text-green-700"><Building className="w-4 h-4" /></Button>);
    buttons.push(<Button key="encaminhar" variant="outline" size="icon" onClick={() => handleForwardToCegor(ocorrencia.id)} title="Encaminhar para CEGOR" className="text-blue-600 hover:text-blue-700"><Send className="w-4 h-4" /></Button>);
    buttons.push(<Button key="executar" variant="outline" size="icon" onClick={() => handleStatusChange(ocorrencia.id, 'em_execucao')} title="Iniciar execução"><Play className="w-4 h-4" /></Button>);
    buttons.push(<Button key="detalhar" variant="outline" size="icon" asChild title="Detalhar Execução"><Link to={`/ocorrencias/${ocorrencia.id}/detalhamento`}><Edit className="w-4 h-4" /></Link></Button>);
    buttons.push(<Button key="aprovar-fiscal" variant="outline" size="icon" asChild title="Concluir Ocorrência (Fiscal)" className="text-green-600 hover:text-green-700"><Link to={`/ocorrencias/${ocorrencia.id}/vistoria_final`}><CheckCircle className="w-4 h-4" /></Link></Button>);
    buttons.push(<Button key="visualizar" variant="outline" size="icon" asChild title="Visualizar"><Link to={`/ocorrencias/${ocorrencia.id}`}><Eye className="w-4 h-4" /></Link></Button>);
    
    return buttons;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ocorrências</h1>
        {(isRegionalOperador(user) || isRegionalGestor(user)) && (
          <Button asChild><Link to="/ocorrencias/nova"><Plus className="w-4 h-4 mr-2" />Nova Ocorrência</Link></Button>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Search className="w-4 h-4" /> Filtros</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input placeholder="Buscar protocolo ou descrição..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="lg:col-span-2" />
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="h-10 px-3 rounded-md border border-input bg-background text-sm"><option value="">Todos os Status</option>{['criada', 'encaminhada', 'autorizada', 'agendada', 'em_execucao', 'executada', 'concluida', 'cancelada', 'devolvida'].map(s => <option key={s} value={s}>{getStatusLabel(s)}</option>)}</select>
          <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} className="h-10 px-3 rounded-md border border-input bg-background text-sm"><option value="">Todas as Prioridades</option><option value="baixa">Baixa</option><option value="media">Média</option><option value="alta">Alta</option></select>
          <select value={selectedEquipamento} onChange={(e) => setSelectedEquipamento(e.target.value)} className="h-10 px-3 rounded-md border border-input bg-background text-sm"><option value="">Todos Equipamentos</option>{uniqueEquipamentos.map(e => <option key={e} value={e}>{e}</option>)}</select>
          <Input type="date" value={scheduledDateFilter} onChange={(e) => setScheduledDateFilter(e.target.value)} className="h-10 px-3 rounded-md border border-input bg-background text-sm" />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{filteredOcorrencias.length} ocorrências encontradas</p>
        <div className="flex items-center justify-end gap-2 p-1 bg-gray-100 rounded-lg">
          <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}><LayoutGrid className="w-4 h-4" /></Button>
          <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
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
                    <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(p - 1, 1)); }} className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined} /></PaginationItem>
                    {[...Array(totalPages).keys()].map(num => (
                      <PaginationItem key={num + 1}><PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(num + 1); }} isActive={currentPage === num + 1}>{num + 1}</PaginationLink></PaginationItem>
                    ))}
                    <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(p + 1, totalPages)); }} className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined} /></PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg"><p className="text-gray-500">Nenhuma ocorrência encontrada.</p></div>
        )}
      </div>

      <Dialog open={!!cancelingOcorrenciaId} onOpenChange={(isOpen) => !isOpen && setCancelingOcorrenciaId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Cancelar Ocorrência</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p>Deseja cancelar a ocorrência {ocorrencias.find(o => o.id === cancelingOcorrenciaId)?.protocol}?</p>
            <Textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Informe o motivo do cancelamento *" rows={3} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCancelingOcorrenciaId(null)}>Voltar</Button>
              <Button variant="destructive" onClick={handleCancellation}>Confirmar Cancelamento</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
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

    </div>
  );
}