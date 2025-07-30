import React, { useState, useMemo } from 'react';
import { Plus, LayoutGrid, List, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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

// Mock de dados atualizado com bairro e regional_name
const mockOcorrencias: OcorrenciaDetalhada[] = [
    { id: '1', protocol: 'OCR-2024-001', description: 'Limpeza de terreno baldio', service_type: 'Limpeza', priority: 'alta', status: 'criada', address: 'Rua das Flores, 123', public_equipment_name: 'Praça do Ferreira', regional_id: '1', fiscal_id: '1', origin: 'SIGEP', vistoria_previa_date: '2025-07-20T08:00:00Z', created_at: '2025-07-20T10:00:00Z', updated_at: '2025-07-20T10:00:00Z', bairro: 'Centro', regional_name: regionalMap['1'] },
    { id: '2', protocol: 'OCR-2024-002', description: 'Reparo em calçada', service_type: 'Manutenção', priority: 'media', status: 'encaminhada', address: 'Av. Beira Mar, 456', public_equipment_name: 'Areninha Campo do América', regional_id: '2', fiscal_id: '2', origin: 'SPU', forwarded_by: '2', forwarded_at: '2025-07-21T11:00:00Z', created_at: '2025-07-21T09:00:00Z', updated_at: '2025-07-21T11:00:00Z', bairro: 'Meireles', regional_name: regionalMap['2'] },
    { id: '3', protocol: 'OCR-2024-003', description: 'Poda de árvores no parque', service_type: 'Conservação', priority: 'baixa', status: 'autorizada', address: 'Av. Padre Antônio Tomás, s/n', public_equipment_name: 'Parque do Cocó', regional_id: '5', fiscal_id: '5', origin: 'REG2', approved_by_regional: '5', approved_at_regional: '2025-07-19T14:00:00Z', vistoria_previa_date: '2025-07-19T12:00:00Z', created_at: '2025-07-19T10:00:00Z', updated_at: '2025-07-19T14:00:00Z', bairro: 'Cocó', regional_name: regionalMap['5'] },
    { id: '4', protocol: 'OCR-2024-004', description: 'Vazamento em poste de saúde', service_type: 'Reparo', priority: 'alta', status: 'agendada', address: 'Rua G, 300', public_equipment_name: 'Posto de Saúde Dr. Hélio Goes', regional_id: '6', fiscal_id: '6', origin: 'SIGEP', scheduled_date: '2025-07-25T09:00:00Z', vistoria_previa_date: '2025-07-22T07:00:00Z', created_at: '2025-07-22T08:00:00Z', updated_at: '2025-07-22T10:00:00Z', bairro: 'Messejana', regional_name: regionalMap['6'] },
    { id: '5', protocol: 'OCR-2024-005', description: 'Manutenção de brinquedos', service_type: 'Manutenção', priority: 'media', status: 'em_execucao', address: 'Rua Paulino Nogueira, s/n', public_equipment_name: 'Praça da Gentilândia', regional_id: '1', fiscal_id: '1', origin: 'REG1', scheduled_date: '2025-07-20T14:00:00Z', vistoria_previa_date: '2025-07-18T13:00:00Z', created_at: '2025-07-18T15:00:00Z', updated_at: '2025-07-20T13:00:00Z', bairro: 'Benfica', regional_name: regionalMap['1'] },
    { id: '6', protocol: 'OCR-2024-006', description: 'Pintura de quadra', service_type: 'Pintura', priority: 'baixa', status: 'executada', address: 'Av. Gov. Leonel Brizola, s/n', public_equipment_name: 'Cuca Jangurussu', regional_id: '4', fiscal_id: '4', origin: 'SPU', scheduled_date: '2025-06-12T08:00:00Z', vistoria_previa_date: '2025-06-10T07:00:00Z', vistoria_pos_date: '2025-06-15T15:00:00Z', created_at: '2025-06-10T09:00:00Z', updated_at: '2025-06-15T16:00:00Z', bairro: 'Jangurussu', regional_name: regionalMap['4'] },
];

const getStatusColor = (status: string) => ({'criada': 'bg-gray-100 text-gray-800','encaminhada': 'bg-blue-100 text-blue-800','autorizada': 'bg-teal-100 text-teal-800','cancelada': 'bg-red-100 text-red-800','devolvida': 'bg-orange-100 text-orange-800','em_analise': 'bg-yellow-100 text-yellow-800','agendada': 'bg-purple-100 text-purple-800','em_execucao': 'bg-cyan-100 text-cyan-800','executada': 'bg-green-100 text-green-800', 'concluida': 'bg-emerald-100 text-emerald-800'}[status] || 'bg-gray-100 text-gray-800');
const getStatusLabel = (status: string) => ({'criada': 'Criada','encaminhada': 'Encaminhada','autorizada': 'Autorizada','cancelada': 'Cancelada','devolvida': 'Devolvida','em_analise': 'Em Análise','agendada': 'Agendada','em_execucao': 'Em Execução','executada': 'Executada', 'concluida': 'Concluída'}[status] || status);
const getPriorityColor = (priority: string) => ({'baixa': 'bg-green-100 text-green-800','media': 'bg-yellow-100 text-yellow-800','alta': 'bg-red-100 text-red-800'}[priority] || 'bg-gray-100 text-gray-800');

// --- Componente da Tabela Refatorado ---
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

// ... (Componente GridView pode ser mantido ou refatorado de forma similar)

export default function ListaOcorrencias() {
  const { user } = useAuth();
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaDetalhada[]>(mockOcorrencias);
  
  // Estados para filtros agora vivem em um único objeto
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    priority: '',
    regional: '',
    bairro: '',
  });
  
  // Outros estados da UI
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingOcorrencia, setViewingOcorrencia] = useState<Ocorrencia | null>(null);
  const itemsPerPage = 5;

  // Função para ser passada ao componente de filtro
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reseta a paginação ao aplicar um novo filtro
  };

  // --- Lógica de Filtragem ---
  const filteredOcorrencias = useMemo(() => {
    return ocorrencias.filter(ocorrencia => {
      if (user?.role === 'regional' && ocorrencia.regional_id !== user.regional_id) return false;
      if (user?.role === 'empresa' && !['autorizada', 'agendada', 'em_execucao', 'executada'].includes(ocorrencia.status)) return false;

      const { searchTerm, status, priority, regional, bairro } = filters;
      const matchesSearch = searchTerm === '' || ocorrencia.protocol.toLowerCase().includes(searchTerm.toLowerCase()) || ocorrencia.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = status === '' || ocorrencia.status === status;
      const matchesPriority = priority === '' || ocorrencia.priority === priority;
      const matchesRegional = regional === '' || ocorrencia.regional_name === regional;
      const matchesBairro = bairro === '' || ocorrencia.bairro === bairro;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesRegional && matchesBairro;
    });
  }, [ocorrencias, filters, user]);

  // Gera listas únicas para passar para o componente de filtro
  const uniqueRegionais = useMemo(() => [...new Set(mockOcorrencias.map(o => o.regional_name))].sort(), [mockOcorrencias]);
  const uniqueBairros = useMemo(() => [...new Set(mockOcorrencias.map(o => o.bairro))].sort(), [mockOcorrencias]);

  // --- Lógica de Paginação ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListItems = filteredOcorrencias.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOcorrencias.length / itemsPerPage);

  // --- Renderização de Botões (e outras lógicas de ação) ---
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

      {/* ATUALIZAÇÃO 3: Componente de Filtro em uso */}
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
      
      <div>
        {filteredOcorrencias.length > 0 ? (
          viewMode === 'list' ? (
            <div className="space-y-4">
              <ListView ocorrencias={currentListItems} renderActionButtons={renderActionButtons} />
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
          ) : (
             <p className="text-center py-16 bg-gray-50 rounded-lg text-gray-500">Visualização em grade não implementada.</p>
            // <GridView ocorrencias={filteredOcorrencias} renderActionButtons={renderActionButtons} />
          )
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhuma ocorrência encontrada para os filtros selecionados.</p>
          </div>
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
