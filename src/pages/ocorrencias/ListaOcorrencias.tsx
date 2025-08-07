import React, { useState, useMemo } from 'react';
import { LayoutGrid, List } from 'lucide-react';
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

// Interface estendida para garantir que os campos existam no mock
interface OcorrenciaDetalhada extends Ocorrencia {
  bairro: string;
  regional_name: string;
  tipo_de_ocorrencia: string;
  service_type: string;
  equipe_id?: string;
  description: string;
}

const regionalMap: { [key: string]: string } = {
  '1': 'Regional I', '2': 'Regional II', '3': 'Regional III', '4': 'Regional IV',
  '5': 'Regional V', '6': 'Regional VI',
};

// Mock de dados com os campos necessários para os filtros
export const mockOcorrencias: OcorrenciaDetalhada[] = [
  { id: '1', protocol: 'OCR-2024-009', tipo_de_ocorrencia: 'Substituição de bancos quebrados', description: 'Solicitação para trocar bancos danificados em praça pública do bairro Parangaba.', service_type: 'Manutenção', priority: 'media', status: 'em_execucao', address: 'Av. José Bastos, 789', public_equipment_name: 'Praça José de Alencar', regional_id: '2', fiscal_id: '2', origin: 'REG2', equipe_id: 'Equipe Manutenção Sul', requester_name: 'Matheus Augusto', created_at: '2025-07-23T09:30:00Z', updated_at: '2025-07-23T09:30:00Z', bairro: 'Parangaba', regional_name: regionalMap['2'] },
  { id: '2', protocol: 'OCR-2024-009', tipo_de_ocorrencia: 'Substituição de bancos quebrados', description: 'Solicitação para trocar bancos danificados em praça pública do bairro Parangaba.', service_type: 'Manutenção', priority: 'media', status: 'pausada', address: 'Av. José Bastos, 789', public_equipment_name: 'Praça José de Alencar', regional_id: '1', fiscal_id: '2', origin: 'REG1', equipe_id: 'Equipe Manutenção Sul', requester_name: 'Carlos Moura', created_at: '2025-07-23T09:30:00Z', updated_at: '2025-07-23T09:30:00Z', bairro: 'Parangaba', regional_name: regionalMap['1'] },
  { id: '10', protocol: 'OCR-2024-010', tipo_de_ocorrencia: 'Verificação de esgoto a céu aberto', description: 'Denúncia de esgoto exposto em via pública próxima ao Canal do Lagamar.', service_type: 'Saneamento', priority: 'alta', status: 'executada', address: 'Rua Eduardo Perdigão, 321', public_equipment_name: 'Canal do Lagamar', regional_id: '5', fiscal_id: '5', origin: 'SIGEP', equipe_id: 'Equipe Saneamento Leste', requester_name: 'Marcela Cavalcante', vistoria_previa_date: '2025-07-22T08:00:00Z', created_at: '2025-07-22T07:30:00Z', updated_at: '2025-07-22T08:30:00Z', bairro: 'São João do Tauape', regional_name: regionalMap['5'] },
  { id: '11', protocol: 'OCR-2024-011', tipo_de_ocorrencia: 'Conserto de lixeira danificada', description: 'Reparo solicitado em lixeira pública quebrada na Praça do Lago Jacarey.', service_type: 'Limpeza', priority: 'baixa', status: 'encaminhada', address: 'Rua Padre Pedro de Alencar, 65', public_equipment_name: 'Praça do Lago Jacarey', regional_id: '6', fiscal_id: '6', origin: 'REG6', equipe_id: 'Equipe Limpeza Urbana A', requester_name: 'Rafael Oliveira', forwarded_by: '6', forwarded_at: '2025-07-21T14:00:00Z', created_at: '2025-07-21T12:00:00Z', updated_at: '2025-07-21T14:00:00Z', bairro: 'Cidade dos Funcionários', regional_name: regionalMap['6'] },
  { id: '12', protocol: 'OCR-2024-012', tipo_de_ocorrencia: 'Reforma de muro de escola', description: 'Solicitação para reforma estrutural do muro da escola E.M. Antônio Sales.', service_type: 'Reparo', priority: 'alta', status: 'executada', address: 'Rua Júlio César, 88', public_equipment_name: 'E.M. Antônio Sales', regional_id: '3', fiscal_id: '3', origin: 'SPU', equipe_id: 'Equipe Obras Norte', requester_name: 'Pedro Alves', approved_by_regional: '3', approved_at_regional: '2025-07-20T13:00:00Z', vistoria_previa_date: '2025-07-20T10:00:00Z', created_at: '2025-07-20T08:00:00Z', updated_at: '2025-07-20T13:00:00Z', bairro: 'Montese', regional_name: regionalMap['3'] },
  { id: '13', protocol: 'OCR-2024-013', tipo_de_ocorrencia: 'Verificação de alagamento', description: 'Registro de possível ponto de alagamento próximo ao mercado no bairro Centro.', service_type: 'Saneamento', priority: 'media', status: 'agendada', address: 'Rua dos Remédios, 12', public_equipment_name: 'Boca de lobo próxima ao mercado', regional_id: '1', fiscal_id: '1', origin: 'SIGEP', equipe_id: 'Equipe Saneamento Oeste', requester_name: 'Carlos Moura', vistoria_previa_date: '2025-07-19T11:00:00Z', created_at: '2025-07-19T10:00:00Z', updated_at: '2025-07-19T11:30:00Z', bairro: 'Centro', regional_name: regionalMap['1'] },
  { id: '14', protocol: 'OCR-2024-014', tipo_de_ocorrencia: 'Pintura de meio-fio', description: 'Execução de pintura de meio-fio na rotatória localizada no Cambeba.', service_type: 'Pintura', priority: 'baixa', status: 'criada', address: 'Av. Rogaciano Leite, 99', public_equipment_name: 'Rotatória do Cambeba', regional_id: '6', fiscal_id: '6', origin: 'REG6', equipe_id: 'Equipe Manutenção Sul', requester_name: 'Assessor Roberto', scheduled_date: '2025-07-18T07:00:00Z', vistoria_previa_date: '2025-07-17T08:00:00Z', vistoria_pos_date: '2025-07-18T18:00:00Z', created_at: '2025-07-17T09:00:00Z', updated_at: '2025-07-18T18:30:00Z', bairro: 'Cambeba', regional_name: regionalMap['6'] },
  { id: '6', protocol: 'OCR-2024-006', tipo_de_ocorrencia: 'Reposição de tampas de bueiro', description: 'Substituição de tampas de bueiros retiradas ou danificadas no Canal do Benfica.', service_type: 'Manutenção', priority: 'alta', status: 'concluida', address: 'Rua Delmiro Gouveia, 456', public_equipment_name: 'Canal do Benfica', regional_id: '4', fiscal_id: '4', origin: 'REG4', equipe_id: 'Equipe Saneamento Leste', requester_name: 'Assessor Joaquim', created_at: '2025-07-15T08:00:00Z', updated_at: '2025-07-25T17:00:00Z', vistoria_pos_date: '2025-07-26T08:30:00Z', bairro: 'Benfica', regional_name: regionalMap['4'] },
  { id: '7', protocol: 'OCR-2024-007', tipo_de_ocorrencia: 'Capinação de área pública', description: 'Capinação realizada em área pública na Praça da Estação, no bairro Centro.', service_type: 'Limpeza', priority: 'media', status: 'concluida', address: 'Rua Princesa Isabel, 999', public_equipment_name: 'Praça da Estação', regional_id: '2', fiscal_id: '2', origin: 'REG2', equipe_id: 'Equipe Limpeza Urbana A', requester_name: 'Antonio Luiz', created_at: '2025-07-10T09:00:00Z', updated_at: '2025-07-26T15:00:00Z', vistoria_pos_date: '2025-07-27T09:00:00Z', bairro: 'Centro', regional_name: regionalMap['2'] },
  { id: '15', protocol: 'OCR-2024-015', tipo_de_ocorrencia: 'Conserto de iluminação pública', description: 'Conserto de postes de luz apagados no Parque Rachel de Queiroz.', service_type: 'Iluminação', priority: 'alta', status: 'em_execucao', address: 'Av. Bezerra de Menezes, 101', public_equipment_name: 'Parque Rachel de Queiroz', regional_id: '3', fiscal_id: '3', origin: 'REG3', equipe_id: 'Equipe Iluminação Noturna', requester_name: 'Marcos Souza', created_at: '2025-07-28T10:00:00Z', updated_at: '2025-07-28T14:00:00Z', bairro: 'Amadeu Furtado', regional_name: regionalMap['3'] },
  { id: '16', protocol: 'OCR-2024-016', tipo_de_ocorrencia: 'Retirada de entulho', description: 'Solicitação de retirada de entulhos acumulados em praça pública no bairro Benfica.', service_type: 'Limpeza', priority: 'baixa', status: 'criada', address: 'Rua Carapinima, 223', public_equipment_name: 'Praça da Gentilândia', regional_id: '4', fiscal_id: '4', origin: 'SIGEP', equipe_id: 'Equipe Limpeza Urbana B', created_at: '2025-07-29T07:30:00Z', updated_at: '2025-07-29T07:30:00Z', bairro: 'Benfica', regional_name: regionalMap['4'] },
  { id: '17', protocol: 'OCR-2024-017', tipo_de_ocorrencia: 'Reparo em calçamento', description: 'Ajustes em calçamento danificado próximo à escola estadual na Aldeota.', service_type: 'Reparo', priority: 'media', status: 'criada', address: 'Rua Padre Valdevino, 87', public_equipment_name: 'Escola Estadual', regional_id: '1', fiscal_id: '1', origin: 'REG1', equipe_id: 'Equipe Obras Norte', requester_name: 'Yuri Jivago', approved_by_regional: '1', approved_at_regional: '2025-07-28T10:00:00Z', created_at: '2025-07-27T08:00:00Z', updated_at: '2025-07-28T10:00:00Z', bairro: 'Aldeota', regional_name: regionalMap['1'] },
  { id: '18', protocol: 'OCR-2024-017', tipo_de_ocorrencia: 'Reparo em calçamento', description: 'Ajustes em calçamento danificado próximo à escola estadual na Aldeota.', service_type: 'Reparo', priority: 'media', status: 'autorizada', address: 'Rua Padre Valdevino, 87', public_equipment_name: 'Escola Estadual', regional_id: '1', fiscal_id: '1', origin: 'REG1', equipe_id: 'Equipe Obras Norte', requester_name: 'Ediel Souza', approved_by_regional: '1', approved_at_regional: '2025-07-28T10:00:00Z', created_at: '2025-07-27T08:00:00Z', updated_at: '2025-07-28T10:00:00Z', bairro: 'Aldeota', regional_name: regionalMap['1'] },
  { id: '19', protocol: 'OCR-2024-019', tipo_de_ocorrencia: 'Instalação de nova lixeira', description: 'Solicitação para instalação de lixeira em área de grande circulação.', service_type: 'Limpeza', priority: 'baixa', status: 'criada', address: 'Rua Barão de Aratanha, 400', public_equipment_name: 'Praça do Coração de Jesus', regional_id: '1', fiscal_id: '1', origin: 'REG1', equipe_id: 'Equipe Limpeza Oeste', requester_name: 'Luciana Lima', created_at: '2025-07-30T09:00:00Z', updated_at: '2025-07-30T09:00:00Z', bairro: 'Centro', regional_name: regionalMap['1'] },
  { id: '20', protocol: 'OCR-2024-020', tipo_de_ocorrencia: 'Reparo em poste danificado', description: 'Poste com fiação exposta oferecendo riscos à população.', service_type: 'Iluminação', priority: 'alta', status: 'em_execucao', address: 'Av. Dom Manuel, 222', public_equipment_name: 'Poste da praça central', regional_id: '1', fiscal_id: '1', origin: 'REG1', equipe_id: 'Equipe Iluminação Norte', requester_name: 'Fábio Martins', created_at: '2025-07-30T14:00:00Z', updated_at: '2025-08-01T08:00:00Z', bairro: 'Centro', regional_name: regionalMap['1'] },
  { id: '21', protocol: 'OCR-2024-021', tipo_de_ocorrencia: 'Pintura de faixa de pedestres', description: 'Faixas apagadas nas proximidades de escola infantil.', service_type: 'Pintura', priority: 'media', status: 'concluida', address: 'Rua Padre Mororó, 55', public_equipment_name: 'Escola Infantil Pequeno Príncipe', regional_id: '1', fiscal_id: '1', origin: 'REG1', equipe_id: 'Equipe Sinalização Viária', requester_name: 'Renata Silva', created_at: '2025-07-27T07:00:00Z', updated_at: '2025-07-30T15:00:00Z', vistoria_pos_date: '2025-07-31T10:00:00Z', bairro: 'Centro', regional_name: regionalMap['1'] },
  { id: '22', protocol: 'OCR-2024-022', tipo_de_ocorrencia: 'Limpeza de bueiro entupido', 
    description: 'Acúmulo de água causado por bueiro entupido próximo ao mercado.', 
    service_type: 'Saneamento', priority: 'alta', status: 'pausada', address: 'Rua Meton de Alencar, 99', 
    public_equipment_name: 'Bueiro da esquina', regional_id: '1', fiscal_id: '1', origin: 'SIGEP', 
    equipe_id: 'Equipe Saneamento Oeste', requester_name: 'Joana Ferreira', created_at: '2025-07-29T11:00:00Z', 
    updated_at: '2025-07-30T09:00:00Z', bairro: 'Centro', regional_name: regionalMap['1'] },
  { id: '23', protocol: 'OCR-2024-023', tipo_de_ocorrencia: 'Verificação estrutural em ponte', 
    description: 'Verificação de rachaduras em ponte que cruza o Riacho Pajeú.', service_type: 'Engenharia',
     priority: 'alta', status: 'executada', address: 'Av. Alberto Nepomuceno, 200', 
     public_equipment_name: 'Ponte do Riacho Pajeú', regional_id: '1', fiscal_id: '1', origin: 'REG1',
      equipe_id: 'Equipe Engenharia Civil', requester_name: 'Fernanda Torres', approved_by_regional: '1', 
      approved_at_regional: '2025-08-01T08:00:00Z', created_at: '2025-07-31T10:00:00Z', updated_at: '2025-08-01T08:00:00Z', bairro: 'Centro', regional_name: regionalMap['1'] },
];



// --- Funções Helper de Estilo ---
const getStatusColor = (status: string) => ({ 'criada': 'bg-gray-100 text-gray-800', 'encaminhada': 'bg-blue-100 text-blue-800', 'autorizada': 'bg-teal-100 text-teal-800', 'cancelada': 'bg-red-100 text-red-800', 'devolvida': 'bg-orange-100 text-orange-800', 'em_analise': 'bg-yellow-100 text-yellow-800', 'agendada': 'bg-purple-100 text-purple-800', 'em_execucao': 'bg-cyan-100 text-cyan-800', 'executada': 'bg-green-100 text-green-800', 'concluida': 'bg-emerald-100 text-emerald-800' }[status] || 'bg-gray-100 text-gray-800');
const getStatusLabel = (status: string) => ({ 'criada': 'Criada', 'encaminhada': 'Encaminhada', 'autorizada': 'Autorizada', 'cancelada': 'Cancelada', 'devolvida': 'Devolvida', 'em_analise': 'Em Análise', 'agendada': 'Agendada', 'em_execucao': 'Em Execução', 'executada': 'Executada', 'concluida': 'Concluída' }[status] || status);
const getPriorityColor = (priority: string) => ({ 'baixa': 'bg-green-100 text-green-800', 'media': 'bg-yellow-100 text-yellow-800', 'alta': 'bg-red-100 text-red-800' }[priority] || 'bg-gray-100 text-gray-800');

// --- Componentes de Visualização (ListView, GridView) - Sem alterações ---
const ListView = ({ ocorrencias, renderActionButtons }: { ocorrencias: OcorrenciaDetalhada[], renderActionButtons: (o: Ocorrencia) => (JSX.Element | null)[] }) => (
  <Card>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Protocolo</TableHead>
          <TableHead>Origem</TableHead>
          <TableHead>Tipo de serviço</TableHead>
          <TableHead>Equipe</TableHead>
          <TableHead>Prioridade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Regional</TableHead>
          <TableHead>Bairro</TableHead>
          <TableHead>Última Atualização</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ocorrencias.map((ocorrencia) => (
          <TableRow key={ocorrencia.id}>
            <TableCell className="font-medium">{ocorrencia.protocol}</TableCell>
            <TableCell className="">{ocorrencia.origin}</TableCell>
            <TableCell className="max-w-xs truncate">{ocorrencia.service_type}</TableCell>
            <TableCell className="">{ocorrencia.equipe_id ? ocorrencia.equipe_id : '---'}</TableCell>
            <TableCell><Badge className={getPriorityColor(ocorrencia.priority)}>{ocorrencia.priority}</Badge></TableCell>
            <TableCell><Badge className={getStatusColor(ocorrencia.status)}>{getStatusLabel(ocorrencia.status)}</Badge></TableCell>
            <TableCell>{ocorrencia.regional_name}</TableCell>
            <TableCell>{ocorrencia.bairro}</TableCell>
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

// Helper para extrair valores únicos
const getUniqueValues = (data: any[], key: keyof OcorrenciaDetalhada) => {
  return [...new Set(data.map(item => item[key]).filter(Boolean))].sort() as string[];
};

export default function ListaOcorrencias() {
  const { user } = useAuth();

  // Passo 2: Atualizar o estado 'filters' para corresponder à nova estrutura
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
  const itemsPerPage = viewMode === 'list' ? 10 : 8;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEquipe, setSelectedEquipe] = useState<string>('');

  const handleFilterChange = (newFilters: Partial<FiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  // Passo 3: Gerar listas de valores únicos para todos os filtros
  const uniqueTiposServico = useMemo(() => getUniqueValues(mockOcorrencias, 'service_type'), []);
  const uniqueEquipamentos = useMemo(() => getUniqueValues(mockOcorrencias, 'public_equipment_name'), []);
  const uniqueRegionais = useMemo(() => getUniqueValues(mockOcorrencias, 'regional_name'), []);
  const uniqueBairros = useMemo(() => getUniqueValues(mockOcorrencias, 'bairro'), []);
  const uniqueOrigens = useMemo(() => getUniqueValues(mockOcorrencias, 'origin'), []);
  const uniqueEquipes = useMemo(() => getUniqueValues(mockOcorrencias, 'equipe_id'), []);


  // Passo 4: Atualizar a lógica de filtragem para usar os novos filtros
  const filteredOcorrencias = useMemo(() => {
    return mockOcorrencias.filter(ocorrencia => {
      // Filtros de acesso (role-based)
      if (user?.role === 'regional' && ocorrencia.regional_id !== user.regional_id) return false;
      if (user?.role === 'empresa' && !['autorizada', 'agendada', 'em_execucao', 'executada'].includes(ocorrencia.status)) return false;

      // Desestruturação do estado de filtros
      const { searchTerm, status, priority, regional, bairro, tipoServico, equipPublico, origem, equipe, dataAtualizacaoInicio, dataAtualizacaoFim } = filters;

      // Lógica de Data (baseada em updated_at)
      const dataOcorrencia = new Date(ocorrencia.updated_at);
      const dataInicioFiltro = dataAtualizacaoInicio ? new Date(dataAtualizacaoInicio + 'T00:00:00') : null;
      const dataFimFiltro = dataAtualizacaoFim ? new Date(dataAtualizacaoFim + 'T23:59:59') : null;
      const matchesDate =
        (!dataInicioFiltro || dataOcorrencia >= dataInicioFiltro) &&
        (!dataFimFiltro || dataOcorrencia <= dataFimFiltro);

      // Lógica de Busca (searchTerm)
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        ocorrencia.protocol.toLowerCase().includes(searchTermLower) ||
        ocorrencia.description.toLowerCase().includes(searchTermLower);

      // Lógica dos Filtros de Seleção (dropdowns)
      const matchesStatus = !status || ocorrencia.status === status;
      const matchesPriority = !priority || ocorrencia.priority === priority;
      const matchesRegional = !regional || ocorrencia.regional_name === regional;
      const matchesBairro = !bairro || ocorrencia.bairro === bairro;
      const matchesTipoServico = !tipoServico || ocorrencia.service_type === tipoServico;
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
    if (action === 'direcionar_ocorrencia') {
      console.log('Direcionar', ocorrenciaId, payload); // payload = { equipe: 'Equipe X' }
      // chamar API para atribuir equipe...
    }
    else if (action === 'pausar_execucao') {
      console.log('Pausar', ocorrenciaId, payload); // payload = { paused: true }
      // chamar API para pausar...
    }
    else if (action === 'retomar_ocorrencia') {
      console.log('Retomar', ocorrenciaId, payload); // payload = { resumed: true, equipe: 'Equipe X' }
      // chamar API para retomar...
    }
    else if (action === 'visualizar') {
      const ocorr = mockOcorrencias.find(o => o.id === ocorrenciaId);
      if (ocorr) setViewingOcorrencia(ocorr);
    } else {
      console.log('Ação genérica', action, ocorrenciaId, payload);
    }
  };
  const renderActionButtons = (ocorrencia: Ocorrencia) => {
    if (!user) return [];

    const permittedActions = getPermittedActions(user.role, user.subrole) || [];
    const permittedStatusActions = getPermittedStatus(ocorrencia.status, user.subrole) || [];

    // Combina as duas permissões, evitando duplicatas
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

      {/* Passo 5: Passar todas as props necessárias para o componente de filtro */}
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