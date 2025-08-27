import React, { useState, useMemo } from 'react';
import { Info, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useAuth } from '@/context/AuthContext';
import { Ocorrencia, getPermittedActions, getPermittedStatus } from '@/types';
import { getActionButton } from '@/utils/actionButtons';
import OcorrenciaViewer from '@/components/ocorrencias/OcorrenciaViewer';
import FilterOcorrencia, { FiltersState } from '@/components/filtersOcorrencias';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// 1. Importar os dados do arquivo JSON
import ocorrenciasData from '@/utils/ocorrencias.json';

// Interface estendida para garantir que os campos existam no mock
interface OcorrenciaDetalhada extends Ocorrencia {
  bairro: string;
  regional_name: string;
  tipo_de_ocorrencia: string;
  occurrence_type: string;
  equipe_id?: string;
  description: string;
}

const regionalMap: { [key: string]: string } = {
  '1': 'Regional I', '2': 'Regional II', '3': 'Regional III', '4': 'Regional IV',
  '5': 'Regional V', '6': 'Regional VI',
};

// 2. Processar os dados importados para adicionar o nome da regional dinamicamente
export const mockOcorrencias: OcorrenciaDetalhada[] = (ocorrenciasData as Ocorrencia[]).map(ocorrencia => ({
  ...ocorrencia,
  regional_name: regionalMap[ocorrencia.regional_id] || 'Desconhecida', // Garante que o nome da regional seja preenchido
}));


// --- Funções Helper de Estilo ---
const getStatusColor = (status: string) => ({ 'criada': 'bg-gray-100 text-gray-800', 'encaminhada': 'bg-blue-100 text-blue-800', 'autorizada': 'bg-teal-100 text-teal-800', 'cancelada': 'bg-red-100 text-red-800', 'devolvida': 'bg-orange-100 text-orange-800', 'em_analise': 'bg-yellow-100 text-yellow-800', 'agendada': 'bg-purple-100 text-purple-800', 'em_execucao': 'bg-cyan-100 text-cyan-800', 'executada': 'bg-green-100 text-green-800', 'concluida': 'bg-emerald-100 text-emerald-800' }[status] || 'bg-gray-100 text-gray-800');
const getStatusLabel = (status: string) => ({ 'criada': 'Criada', 'encaminhada': 'Encaminhada', 'autorizada': 'Autorizada', 'cancelada': 'Cancelada', 'devolvida': 'Devolvida', 'em_analise': 'Em Análise', 'agendada': 'Agendada', 'em_execucao': 'Em Execução', 'executada': 'Executada', 'concluida': 'Concluída' }[status] || status);
const getPriorityColor = (priority: string) => ({ 'baixa': 'bg-green-100 text-green-800', 'media': 'bg-yellow-100 text-yellow-800', 'alta': 'bg-red-100 text-red-800' }[priority] || 'bg-gray-100 text-gray-800');

// --- Componentes de Visualização (ListView, GridView) ---
const ListView = ({ ocorrencias, renderActionButtons, onInfoClick }: { ocorrencias: OcorrenciaDetalhada[], renderActionButtons: (o: Ocorrencia) => (JSX.Element | null)[], onInfoClick: (o: OcorrenciaDetalhada) => void }) => (
  <Card>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Protocolo</TableHead>
          <TableHead>Origem</TableHead>
          <TableHead>Tipo de ocorrência</TableHead>
          <TableHead>Equipe</TableHead>
          <TableHead>Prioridade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Info</TableHead>
          <TableHead>Última Atualização</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ocorrencias.map((ocorrencia) => (
          <TableRow key={ocorrencia.id}>
            <TableCell className="font-medium">{ocorrencia.protocol}</TableCell>
            <TableCell className="">{ocorrencia.origin}</TableCell>
            <TableCell className="max-w-xs truncate">{ocorrencia.occurrence_type}</TableCell>
            <TableCell className="">{ocorrencia.equipe_id ? ocorrencia.equipe_id : '---'}</TableCell>
            <TableCell><Badge className={getPriorityColor(ocorrencia.priority)}>{ocorrencia.priority}</Badge></TableCell>
            <TableCell><Badge className={getStatusColor(ocorrencia.status)}>{getStatusLabel(ocorrencia.status)}</Badge></TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" onClick={() => onInfoClick(ocorrencia)}>
                <Info className="h-4 w-4" />
              </Button>
            </TableCell>
            <TableCell>{new Date(ocorrencia.updated_at).toLocaleDateString('pt-BR')}</TableCell>
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

const GridView = ({ ocorrencias, renderActionButtons, onInfoClick }: { ocorrencias: OcorrenciaDetalhada[], renderActionButtons: (o: Ocorrencia) => (JSX.Element | null)[], onInfoClick: (o: OcorrenciaDetalhada) => void }) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {ocorrencias.map((ocorrencia) => (
      <Card key={ocorrencia.id} className="flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{ocorrencia.protocol}</CardTitle>
            <Badge className={getPriorityColor(ocorrencia.priority)}>{ocorrencia.priority}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{ocorrencia.occurrence_type}</p>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">{ocorrencia.description}</p>
          <p className="text-sm text-gray-600"><strong>Equipamento:</strong> {ocorrencia.public_equipment_name}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Badge className={getStatusColor(ocorrencia.status)}>{getStatusLabel(ocorrencia.status)}</Badge>
          </div>
        </CardContent>
        <div className="flex items-center justify-between p-4 pt-2 border-t mt-auto">
           <Button variant="ghost" size="icon" onClick={() => onInfoClick(ocorrencia)}>
             <Info className="w-4 h-4" />
           </Button>
          <div className="flex items-center justify-end gap-2">
            {renderActionButtons(ocorrencia)}
          </div>
        </div>
      </Card>
    ))}
  </div>
);

// Helper para extrair valores únicos
const getUniqueValues = (data: any[], key: keyof OcorrenciaDetalhada) => {
  return [...new Set(data.map(item => item[key]).filter(Boolean))].sort() as string[];
};

export default function ListaOcorrencias() {
  const { user } = useAuth();
  
  const [filters, setFilters] = useState<FiltersState>({
    searchTerm: '',
    tipoServico: '',
    equipPublico: '',
    regional: '',
    bairro: '',
    origem: '',
    equipe: '',
    status: '',
    priority: '',
    dataAtualizacaoInicio: '',
    dataAtualizacaoFim: '',
  });

  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingOcorrencia, setViewingOcorrencia] = useState<Ocorrencia | null>(null);
  const [infoOcorrencia, setInfoOcorrencia] = useState<OcorrenciaDetalhada | null>(null);
  const itemsPerPage = viewMode === 'list' ? 10 : 8;

  const handleFilterChange = (newFilters: Partial<FiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const uniqueTiposServico = useMemo(() => getUniqueValues(mockOcorrencias, 'occurrence_type'), []);
  const uniqueEquipamentos = useMemo(() => getUniqueValues(mockOcorrencias, 'public_equipment_name'), []);
  const uniqueRegionais = useMemo(() => getUniqueValues(mockOcorrencias, 'regional_name'), []);
  const uniqueBairros = useMemo(() => getUniqueValues(mockOcorrencias, 'bairro'), []);
  const uniqueOrigens = useMemo(() => getUniqueValues(mockOcorrencias, 'origin'), []);
  const uniqueEquipes = useMemo(() => getUniqueValues(mockOcorrencias, 'equipe_id'), []);

  const filteredOcorrencias = useMemo(() => {
    return mockOcorrencias.filter(ocorrencia => {
      if (user?.role === 'regional' && ocorrencia.regional_id !== user.regional_id) return false;
      if (user?.role === 'empresa' && !['autorizada', 'agendada', 'em_execucao', 'executada'].includes(ocorrencia.status)) return false;

      const { searchTerm, status, priority, regional, bairro, tipoServico, equipPublico, origem, equipe, dataAtualizacaoInicio, dataAtualizacaoFim } = filters;

      const dataOcorrencia = new Date(ocorrencia.updated_at);
      const dataInicioFiltro = dataAtualizacaoInicio ? new Date(dataAtualizacaoInicio + 'T00:00:00') : null;
      const dataFimFiltro = dataAtualizacaoFim ? new Date(dataAtualizacaoFim + 'T23:59:59') : null;
      const matchesDate =
        (!dataInicioFiltro || dataOcorrencia >= dataInicioFiltro) &&
        (!dataFimFiltro || dataOcorrencia <= dataFimFiltro);

      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        ocorrencia.protocol.toLowerCase().includes(searchTermLower) ||
        ocorrencia.description.toLowerCase().includes(searchTermLower);

      const matchesStatus = !status || ocorrencia.status === status;
      const matchesPriority = !priority || ocorrencia.priority === priority;
      const matchesRegional = !regional || ocorrencia.regional_name === regional;
      const matchesBairro = !bairro || ocorrencia.bairro === bairro;
      const matchesTipoServico = !tipoServico || ocorrencia.occurrence_type === tipoServico;
      const matchesEquipPublico = !equipPublico || ocorrencia.public_equipment_name === equipPublico;
      const matchesOrigem = !origem || ocorrencia.origin === origem;
      const matchesEquipe = !equipe || ocorrencia.equipe_id === equipe;

      return matchesSearch && matchesStatus && matchesPriority && matchesRegional && matchesBairro && matchesDate && matchesTipoServico && matchesEquipPublico && matchesOrigem && matchesEquipe;
    });
  }, [filters, user]);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredOcorrencias.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredOcorrencias, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOcorrencias.length / itemsPerPage);

  const handleAction = (action: string, ocorrenciaId: string, payload?: any) => {
    if (action === 'visualizar') {
      const ocorr = mockOcorrencias.find(o => o.id === ocorrenciaId);
      if (ocorr) setViewingOcorrencia(ocorr);
    } else {
      console.log('Ação:', action, 'ID:', ocorrenciaId, 'Payload:', payload);
    }
  };
  
  const renderActionButtons = (ocorrencia: Ocorrencia) => {
    if (!user) return [];
    const permittedActions = getPermittedActions(user.role, user.subrole) || [];
    const permittedStatusActions = getPermittedStatus(ocorrencia.status, user.subrole) || [];
    const allActions = Array.from(new Set([...permittedActions, ...permittedStatusActions]));

    return allActions
      .map(action =>
        getActionButton(
          action,
          ocorrencia.id,
          (id, payload) => handleAction(action, id, payload),
          { equipes: uniqueEquipes, currentEquipe: ocorrencia.equipe_id ?? null }
        )
      )
      .filter(Boolean);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ocorrências</h1>
      </div>

      <FilterOcorrencia
        filters={filters}
        onFilterChange={handleFilterChange}
        uniqueTiposServico={uniqueTiposServico}
        uniqueEquipamentos={uniqueEquipamentos}
        uniqueRegionais={uniqueRegionais}
        uniqueBairros={uniqueBairros}
        uniqueOrigens={uniqueOrigens}
        uniqueEquipes={uniqueEquipes}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{filteredOcorrencias.length} ocorrências encontradas</p>
        <div className="flex items-center justify-end gap-2 p-1 bg-gray-100 rounded-lg">
          <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}><LayoutGrid className="w-4 h-4" /></Button>
          <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="space-y-4">
        {currentItems.length > 0 ? (
          viewMode === 'list'
            ? <ListView ocorrencias={currentItems} renderActionButtons={renderActionButtons} onInfoClick={setInfoOcorrencia} />
            : <GridView ocorrencias={currentItems} renderActionButtons={renderActionButtons} onInfoClick={setInfoOcorrencia} />
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

      {infoOcorrencia && (
        <Dialog open={!!infoOcorrencia} onOpenChange={() => setInfoOcorrencia(null)}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Detalhes: {infoOcorrencia.protocol}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <div className="flex justify-between"><span className="text-sm font-medium text-muted-foreground">Criação:</span><span className="text-sm">{new Date(infoOcorrencia.created_at).toLocaleString('pt-BR')}</span></div>
              <div className="flex justify-between"><span className="text-sm font-medium text-muted-foreground">Tipo:</span><span className="text-sm">{infoOcorrencia.occurrence_type}</span></div>
              <div className="flex justify-between"><span className="text-sm font-medium text-muted-foreground">Status:</span><Badge className={`${getStatusColor(infoOcorrencia.status)} text-xs`}>{getStatusLabel(infoOcorrencia.status)}</Badge></div>
              <div className="flex justify-between"><span className="text-sm font-medium text-muted-foreground">Regional:</span><span className="text-sm">{infoOcorrencia.regional_name}</span></div>
              <div className="flex justify-between"><span className="text-sm font-medium text-muted-foreground">Bairro:</span><span className="text-sm">{infoOcorrencia.bairro}</span></div>
              <div className="flex justify-between"><span className="text-sm font-medium text-muted-foreground">Endereço:</span><span className="text-sm text-right">{infoOcorrencia.address}</span></div>
              <div className="pt-2">
                <span className="text-sm font-medium text-muted-foreground">Descrição:</span>
                <p className="text-sm text-foreground mt-1">{infoOcorrencia.description}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
