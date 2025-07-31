import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Filter } from 'lucide-react';

// --- Interfaces para Tipagem ---

// Define a estrutura do objeto de filtros que o componente irá gerenciar.
export interface FiltersState {
  searchTerm: string;
  tipoServico: string;
  equipPublico: string;
  regional: string;
  bairro: string;
  origem: string;
  equipe: string;
  status: string;
  priority: string;
  dataAtualizacaoInicio: string;
  dataAtualizacaoFim: string;
}

// Define todas as props que o componente precisa receber de seu pai.
interface FiltroOcorrenciasProps {
  filters: FiltersState;
  onFilterChange: (filters: Partial<FiltersState>) => void;
  uniqueTiposServico: string[];
  uniqueEquipamentos: string[];
  uniqueRegionais: string[];
  uniqueBairros: string[];
  uniqueOrigens: string[];
  uniqueEquipes: string[];
}

// Helper para obter a lista de status (para manter a consistência)
const getStatusLabel = (status: string) => ({
  'criada': 'Criada', 'encaminhada': 'Encaminhada', 'autorizada': 'Autorizada',
  'cancelada': 'Cancelada', 'devolvida': 'Devolvida', 'em_analise': 'Em Análise',
  'agendada': 'Agendada', 'em_execucao': 'Em Execução', 'executada': 'Executada',
  'concluida': 'Concluída'
}[status] || status);


export default function FilterOcorrencia({
  filters,
  onFilterChange,
  uniqueTiposServico,
  uniqueEquipamentos,
  uniqueRegionais,
  uniqueBairros,
  uniqueOrigens,
  uniqueEquipes,
}: FiltroOcorrenciasProps) {

  // Handler genérico para atualizar os filtros no estado do componente pai.
  const handleChange = (key: keyof FiltersState, value: string) => {
    onFilterChange({ [key]: value });
  };

  // Handler para limpar todos os filtros, resetando o estado no componente pai.
  const handleClearFilters = () => {
    onFilterChange({
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
  };

  return (
    <Accordion type="single" collapsible className="w-full bg-white rounded-lg shadow-sm">
      <AccordionItem value="item-1" className="border-b-0">
        {/* --- CABEÇALHO DO ACCORDION --- */}
        <AccordionTrigger className="p-4 hover:no-underline">
          <div className="grid grid-cols-12 items-center w-full gap-4">
            <div className="col-span-8 flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-base text-gray-800">Filtros de Pesquisa</span>
              <Input
                id="search-term"
                placeholder="Buscar por protocolo, descrição..."
                value={filters.searchTerm}
                onChange={(e) => handleChange('searchTerm', e.target.value)}
                className="bg-gray-50 flex-1 min-w-0"
              />
            </div>
            {/* Esta div impede o clique no input de fechar o accordion */}
            <div className="col-span-4" onClick={(e) => e.stopPropagation()}>
              {/* Adicione aqui mais inputs ou filtros se necessário */}
            </div>
          </div>
        </AccordionTrigger>

        
        {/* --- CONTEÚDO DO ACCORDION COM OS FILTROS --- */}
        <AccordionContent className="pt-4 px-4 pb-4 border-t">
          <div className="grid gap-6">
            {/* --- PRIMEIRA LINHA DE FILTROS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="tipo-servico-filter">Por Tipo de Serviço</Label>
                <select id="tipo-servico-filter" value={filters.tipoServico} onChange={(e) => handleChange('tipoServico', e.target.value)} className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm">
                  <option value="">Todos</option>
                  {uniqueTiposServico.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="equip-publico-filter">Por Equip. Público</Label>
                <select id="equip-publico-filter" value={filters.equipPublico} onChange={(e) => handleChange('equipPublico', e.target.value)} className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm">
                  <option value="">Todos</option>
                  {uniqueEquipamentos.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="regional-filter">Por Regional</Label>
                <select id="regional-filter" value={filters.regional} onChange={(e) => handleChange('regional', e.target.value)} className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm">
                  <option value="">Todas</option>
                  {uniqueRegionais.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bairro-filter">Por Bairro</Label>
                <select id="bairro-filter" value={filters.bairro} onChange={(e) => handleChange('bairro', e.target.value)} className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm">
                  <option value="">Todos</option>
                  {uniqueBairros.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            {/* --- SEGUNDA LINHA DE FILTROS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="origem-filter">Por Origem</Label>
                <select id="origem-filter" value={filters.origem} onChange={(e) => handleChange('origem', e.target.value)} className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm">
                  <option value="">Todas</option>
                  {uniqueOrigens.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="equipe-filter">Por Equipe</Label>
                <select id="equipe-filter" value={filters.equipe} onChange={(e) => handleChange('equipe', e.target.value)} className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm">
                  <option value="">Todas</option>
                  {uniqueEquipes.map(eq => <option key={eq} value={eq}>{eq}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status-filter">Por Status</Label>
                <select id="status-filter" value={filters.status} onChange={(e) => handleChange('status', e.target.value)} className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm">
                  <option value="">Todos</option>
                  {['criada', 'encaminhada', 'autorizada', 'agendada', 'em_execucao', 'executada', 'concluida', 'cancelada', 'devolvida'].map(s => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="priority-filter">Por Prioridade</Label>
                <select id="priority-filter" value={filters.priority} onChange={(e) => handleChange('priority', e.target.value)} className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm">
                  <option value="">Todas</option>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>

            {/* --- TERCEIRA LINHA: DATA E LIMPAR --- */}
            <div className="border-t pt-4 mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-1.5">
                    <Label htmlFor="data-inicio">Data da Última Atualização (De)</Label>
                    <Input id="data-inicio" type="date" value={filters.dataAtualizacaoInicio} onChange={(e) => handleChange('dataAtualizacaoInicio', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="data-fim">Até</Label>
                    <Input id="data-fim" type="date" value={filters.dataAtualizacaoFim} onChange={(e) => handleChange('dataAtualizacaoFim', e.target.value)} />
                </div>
                <div className="md:justify-self-end w-full">
                    <Button onClick={handleClearFilters} variant="ghost" className="w-full text-red-600 hover:bg-red-50 hover:text-red-700">
                        Limpar Filtros
                    </Button>
                </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}