import React, { useState, useMemo } from 'react';
import { Plus, LayoutGrid, List, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import FilterOcorrencia from '@/components/filtersOcorrencias';

// Interface estendida para garantir que os campos existam no mock
interface OcorrenciaDetalhada extends Ocorrencia {
  bairro: string;
  regional_name: string;
}

const regionalMap: { [key: string]: string } = {
  '1': 'Regional I', '2': 'Regional II', '3': 'Regional III', '4': 'Regional IV',
  '5': 'Regional V', '6': 'Regional VI'
};

// Mock de dados com os campos necessários para os filtros
const mockOcorrencias: OcorrenciaDetalhada[] = [
  { id: '1', protocol: 'OCR-2024-009', description: 'Substituição de bancos quebrados', service_type: 'Manutenção', priority: 'media', status: 'criada', address: 'Av. José Bastos, 789', public_equipment_name: 'Praça José de Alencar', regional_id: '2', fiscal_id: '2', origin: 'REG2', created_at: '2025-07-23T09:30:00Z', updated_at: '2025-07-23T09:30:00Z', bairro: 'Parangaba', regional_name: regionalMap['2'] },
  { id: '10', protocol: 'OCR-2024-010', description: 'Verificação de esgoto a céu aberto', service_type: 'Saneamento', priority: 'alta', status: 'executada', address: 'Rua Eduardo Perdigão, 321', public_equipment_name: 'Canal do Lagamar', regional_id: '5', fiscal_id: '5', origin: 'SIGEP', vistoria_previa_date: '2025-07-22T08:00:00Z', created_at: '2025-07-22T07:30:00Z', updated_at: '2025-07-22T08:30:00Z', bairro: 'São João do Tauape', regional_name: regionalMap['5'] },
  { id: '11', protocol: 'OCR-2024-011', description: 'Conserto de lixeira danificada', service_type: 'Limpeza', priority: 'baixa', status: 'encaminhada', address: 'Rua Padre Pedro de Alencar, 65', public_equipment_name: 'Praça do Lago Jacarey', regional_id: '6', fiscal_id: '6', origin: 'REG6', forwarded_by: '6', forwarded_at: '2025-07-21T14:00:00Z', created_at: '2025-07-21T12:00:00Z', updated_at: '2025-07-21T14:00:00Z', bairro: 'Cidade dos Funcionários', regional_name: regionalMap['6'] },
  { id: '12', protocol: 'OCR-2024-012', description: 'Reforma de muro de escola', service_type: 'Reparo', priority: 'alta', status: 'autorizada', address: 'Rua Júlio César, 88', public_equipment_name: 'E.M. Antônio Sales', regional_id: '3', fiscal_id: '3', origin: 'SPU', approved_by_regional: '3', approved_at_regional: '2025-07-20T13:00:00Z', vistoria_previa_date: '2025-07-20T10:00:00Z', created_at: '2025-07-20T08:00:00Z', updated_at: '2025-07-20T13:00:00Z', bairro: 'Montese', regional_name: regionalMap['3'] },
  { id: '13', protocol: 'OCR-2024-013', description: 'Verificação de alagamento', service_type: 'Saneamento', priority: 'media', status: 'agendada', address: 'Rua dos Remédios, 12', public_equipment_name: 'Boca de lobo próxima ao mercado', regional_id: '1', fiscal_id: '1', origin: 'SIGEP', vistoria_previa_date: '2025-07-19T11:00:00Z', created_at: '2025-07-19T10:00:00Z', updated_at: '2025-07-19T11:30:00Z', bairro: 'Centro', regional_name: regionalMap['1'] },
  { id: '14', protocol: 'OCR-2024-014', description: 'Pintura de meio-fio', service_type: 'Pintura', priority: 'baixa', status: 'executada', address: 'Av. Rogaciano Leite, 99', public_equipment_name: 'Rotatória do Cambeba', regional_id: '6', fiscal_id: '6', origin: 'REG6', scheduled_date: '2025-07-18T07:00:00Z', vistoria_previa_date: '2025-07-17T08:00:00Z', vistoria_pos_date: '2025-07-18T18:00:00Z', created_at: '2025-07-17T09:00:00Z', updated_at: '2025-07-18T18:30:00Z', bairro: 'Cambeba', regional_name: regionalMap['6'] },

  // Novos registros:
  { id: '6', protocol: 'OCR-2024-006', description: 'Reposição de tampas de bueiro', service_type: 'Manutenção', priority: 'alta', status: 'concluida', address: 'Rua Delmiro Gouveia, 456', public_equipment_name: 'Canal do Benfica', regional_id: '4', fiscal_id: '4', origin: 'REG4', created_at: '2025-07-15T08:00:00Z', updated_at: '2025-07-25T17:00:00Z', bairro: 'Benfica', regional_name: regionalMap['4'] },
  { id: '7', protocol: 'OCR-2024-007', description: 'Capinação de área pública', service_type: 'Limpeza', priority: 'media', status: 'concluida', address: 'Rua Princesa Isabel, 999', public_equipment_name: 'Praça da Estação', regional_id: '2', fiscal_id: '2', origin: 'REG2', created_at: '2025-07-10T09:00:00Z', updated_at: '2025-07-26T15:00:00Z', bairro: 'Centro', regional_name: regionalMap['2'] },
  { id: '15', protocol: 'OCR-2024-015', description: 'Conserto de iluminação pública', service_type: 'Iluminação', priority: 'alta', status: 'em execução', address: 'Av. Bezerra de Menezes, 101', public_equipment_name: 'Parque Rachel de Queiroz', regional_id: '3', fiscal_id: '3', origin: 'REG3', created_at: '2025-07-28T10:00:00Z', updated_at: '2025-07-28T14:00:00Z', bairro: 'Amadeu Furtado', regional_name: regionalMap['3'] },
  { id: '16', protocol: 'OCR-2024-016', description: 'Retirada de entulho', service_type: 'Limpeza', priority: 'baixa', status: 'criada', address: 'Rua Carapinima, 223', public_equipment_name: 'Praça da Gentilândia', regional_id: '4', fiscal_id: '4', origin: 'SIGEP', created_at: '2025-07-29T07:30:00Z', updated_at: '2025-07-29T07:30:00Z', bairro: 'Benfica', regional_name: regionalMap['4'] },
  { id: '17', protocol: 'OCR-2024-017', description: 'Reparo em calçamento', service_type: 'Reparo', priority: 'media', status: 'autorizada', address: 'Rua Padre Valdevino, 87', public_equipment_name: 'Escola Estadual', regional_id: '1', fiscal_id: '1', origin: 'REG1', approved_by_regional: '1', approved_at_regional: '2025-07-28T10:00:00Z', created_at: '2025-07-27T08:00:00Z', updated_at: '2025-07-28T10:00:00Z', bairro: 'Aldeota', regional_name: regionalMap['1'] },
];


const getStatusColor = (status: string) => ({'criada': 'bg-gray-100 text-gray-800','encaminhada': 'bg-blue-100 text-blue-800','autorizada': 'bg-teal-100 text-teal-800','cancelada': 'bg-red-100 text-red-800','devolvida': 'bg-orange-100 text-orange-800','em_analise': 'bg-yellow-100 text-yellow-800','agendada': 'bg-purple-100 text-purple-800','em_execucao': 'bg-cyan-100 text-cyan-800','executada': 'bg-green-100 text-green-800', 'concluida': 'bg-emerald-100 text-emerald-800'}[status] || 'bg-gray-100 text-gray-800');
const getStatusLabel = (status: string) => ({'criada': 'Criada','encaminhada': 'Encaminhada','autorizada': 'Autorizada','cancelada': 'Cancelada','devolvida': 'Devolvida','em_analise': 'Em Análise','agendada': 'Agendada','em_execucao': 'Em Execução','executada': 'Executada', 'concluida': 'Concluída'}[status] || status);
const getPriorityColor = (priority: string) => ({'baixa': 'bg-green-100 text-green-800','media': 'bg-yellow-100 text-yellow-800','alta': 'bg-red-100 text-red-800'}[priority] || 'bg-gray-100 text-gray-800');

// --- Componentes de Visualização ---
const ListView = ({ ocorrencias, renderActionButtons }: { ocorrencias: OcorrenciaDetalhada[], renderActionButtons: (o: Ocorrencia) => (JSX.Element | null)[] }) => (
  <Card>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Protocolo</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Prioridade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Regional</TableHead>
          <TableHead>Bairro</TableHead>
          <TableHead>Vistoria Final</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ocorrencias.map((ocorrencia) => (
          <TableRow key={ocorrencia.id}>
            <TableCell className="font-medium">{ocorrencia.protocol}</TableCell>
            <TableCell className="max-w-xs truncate">{ocorrencia.description}</TableCell>
            <TableCell><Badge className={getPriorityColor(ocorrencia.priority)}>{ocorrencia.priority}</Badge></TableCell>
            <TableCell><Badge className={getStatusColor(ocorrencia.status)}>{getStatusLabel(ocorrencia.status)}</Badge></TableCell>
            <TableCell>{ocorrencia.regional_name}</TableCell>
            <TableCell>{ocorrencia.bairro}</TableCell>
            <TableCell>
              {ocorrencia.vistoria_pos_date 
                ? new Date(ocorrencia.vistoria_pos_date).toLocaleDateString('pt-BR')
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

const GridView = ({ ocorrencias, renderActionButtons }: { ocorrencias: OcorrenciaDetalhada[], renderActionButtons: (o: Ocorrencia) => (JSX.Element | null)[] }) => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ocorrencias.map((ocorrencia) => (
            <Card key={ocorrencia.id} className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{ocorrencia.protocol}</CardTitle>
                        <Badge className={getPriorityColor(ocorrencia.priority)}>{ocorrencia.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{ocorrencia.service_type}</p>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">{ocorrencia.description}</p>
                    <p className="text-sm text-gray-600"><strong>Equipamento:</strong> {ocorrencia.public_equipment_name}</p>
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
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaDetalhada[]>(mockOcorrencias);
  
  // ATUALIZAÇÃO 2: Estado dos filtros agora inclui as datas
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    priority: '',
    regional: '',
    bairro: '',
    dataInicio: '',
    dataFim: '',
  });
  
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingOcorrencia, setViewingOcorrencia] = useState<Ocorrencia | null>(null);
  const itemsPerPage = viewMode === 'list' ? 5 : 8;

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  // ATUALIZAÇÃO 3: Lógica de filtragem atualizada para incluir o período
  const filteredOcorrencias = useMemo(() => {
    return ocorrencias.filter(ocorrencia => {
      if (user?.role === 'regional' && ocorrencia.regional_id !== user.regional_id) return false;
      if (user?.role === 'empresa' && !['autorizada', 'agendada', 'em_execucao', 'executada'].includes(ocorrencia.status)) return false;

      const { searchTerm, status, priority, regional, bairro, dataInicio, dataFim } = filters;
      
      const dataOcorrencia = new Date(ocorrencia.created_at);
      const dataInicioFiltro = dataInicio ? new Date(dataInicio + 'T00:00:00') : null;
      const dataFimFiltro = dataFim ? new Date(dataFim + 'T23:59:59') : null;

      const matchesDate = 
        (!dataInicioFiltro || dataOcorrencia >= dataInicioFiltro) &&
        (!dataFimFiltro || dataOcorrencia <= dataFimFiltro);
      
      const matchesSearch = searchTerm === '' || ocorrencia.protocol.toLowerCase().includes(searchTerm.toLowerCase()) || ocorrencia.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = status === '' || ocorrencia.status === status;
      const matchesPriority = priority === '' || ocorrencia.priority === priority;
      const matchesRegional = regional === '' || ocorrencia.regional_name === regional;
      const matchesBairro = bairro === '' || ocorrencia.bairro === bairro;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesRegional && matchesBairro && matchesDate;
    });
  }, [ocorrencias, filters, user]);

  const uniqueRegionais = useMemo(() => [...new Set(mockOcorrencias.map(o => o.regional_name))].sort(), [mockOcorrencias]);
  const uniqueBairros = useMemo(() => [...new Set(mockOcorrencias.map(o => o.bairro))].sort(), [mockOcorrencias]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOcorrencias.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOcorrencias.length / itemsPerPage);

  const handleAction = (action: string, ocorrenciaId: string) => {
    const ocorrencia = ocorrencias.find(o => o.id === ocorrenciaId);
    if (!ocorrencia) return;
    
    if (action === 'visualizar') {
      setViewingOcorrencia(ocorrencia);
    } else {
      console.log(`Ação ${action} para ocorrência ${ocorrenciaId}`);
    }
  };

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
      </div>

      <FilterOcorrencia
        filters={filters}
        onFilterChange={handleFilterChange}
        uniqueRegionais={uniqueRegionais}
        uniqueBairros={uniqueBairros}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{filteredOcorrencias.length} ocorrências encontradas</p>
        <div className="flex items-center justify-end gap-2 p-1 bg-gray-100 rounded-lg">
          <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}><LayoutGrid className="w-4 h-4" /></Button>
          <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredOcorrencias.length > 0 ? (
          viewMode === 'list' 
            ? <ListView ocorrencias={currentItems} renderActionButtons={renderActionButtons} />
            : <GridView ocorrencias={currentItems} renderActionButtons={renderActionButtons} />
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhuma ocorrência encontrada para os filtros selecionados.</p>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(p - 1, 1)); }} className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined} />
              </PaginationItem>
              {[...Array(totalPages).keys()].map(num => (
                <PaginationItem key={num + 1}>
                  <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(num + 1); }} isActive={currentPage === num + 1}>{num + 1}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(p + 1, totalPages)); }} className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

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
