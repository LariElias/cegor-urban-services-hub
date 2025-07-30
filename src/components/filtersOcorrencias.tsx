import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Helper para obter a lista de status
const getStatusLabel = (status: string) => ({'criada': 'Criada','encaminhada': 'Encaminhada','autorizada': 'Autorizada','cancelada': 'Cancelada','devolvida': 'Devolvida','em_analise': 'Em Análise','agendada': 'Agendada','em_execucao': 'Em Execução','executada': 'Executada', 'concluida': 'Concluída'}[status] || status);

// Tipos para as props do componente, agora incluindo as datas
interface Filters {
  searchTerm: string;
  status: string;
  priority: string;
  regional: string;
  bairro: string;
  dataInicio: string;
  dataFim: string;
}

interface FiltroOcorrenciasProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  uniqueRegionais: string[];
  uniqueBairros: string[];
}

export default function FilterOcorrencia({
  filters,
  onFilterChange,
  uniqueRegionais,
  uniqueBairros,
}: FiltroOcorrenciasProps) {
  const { user } = useAuth();

  // Handler genérico para atualizar os filtros
  const handleChange = (key: keyof Filters, value: string) => {
    const finalValue = value.startsWith('Todos') ? '' : value;
    onFilterChange({ [key]: finalValue });
  };
  
  // Handler para limpar todos os filtros
  const handleClearFilters = () => {
    onFilterChange({
      searchTerm: '',
      status: '',
      priority: '',
      regional: '',
      bairro: '',
      dataInicio: '',
      dataFim: '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-4 h-4" /> Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12 gap-x-4 gap-y-6">
          
          {/* Linha 1: Pesquisa */}
          <div className="col-span-12 md:col-span-6 space-y-2">
            <Label htmlFor="search-term">Pesquisar</Label>
            <Input
              id="search-term"
              placeholder="Buscar por protocolo ou descrição..."
              value={filters.searchTerm}
              onChange={(e) => handleChange('searchTerm', e.target.value)}
            />
          </div>

          {/* Linha 2: Filtros de Seleção */}
          <div className="col-span-12 grid grid-cols-12 gap-x-4 gap-y-6">
            <div className="col-span-12 sm:col-span-6 md:col-span-3 space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <select
                id="status-filter"
                value={filters.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Todos os Status</option>
                {['criada', 'encaminhada', 'autorizada', 'agendada', 'em_execucao', 'executada', 'concluida', 'cancelada', 'devolvida'].map(s => 
                  <option key={s} value={s}>{getStatusLabel(s)}</option>
                )}
              </select>
            </div>

            <div className="col-span-12 sm:col-span-6 md:col-span-3 space-y-2">
              <Label htmlFor="priority-filter">Prioridade</Label>
              <select
                id="priority-filter"
                value={filters.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Todas as Prioridades</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            {user?.role === 'cegor' && (
              <div className="col-span-12 sm:col-span-6 md:col-span-3 space-y-2">
                <Label htmlFor="regional-filter">Regional</Label>
                <select
                    id="regional-filter"
                    value={filters.regional}
                    onChange={(e) => handleChange('regional', e.target.value)}
                    className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm"
                >
                    <option value="">Todas as Regionais</option>
                    {uniqueRegionais.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            )}

            <div className="col-span-12 sm:col-span-6 md:col-span-3 space-y-2">
              <Label htmlFor="bairro-filter">Bairro</Label>
              <select
                id="bairro-filter"
                value={filters.bairro}
                onChange={(e) => handleChange('bairro', e.target.value)}
                className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Todos os Bairros</option>
                {uniqueBairros.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          {/* Linha 3: Filtros de Data e Botão */}
          <div className="col-span-12 border-t pt-4 mt-2 grid grid-cols-12 gap-x-4 gap-y-6 items-end">
            <div className="col-span-12 sm:col-span-6 md:col-span-3 space-y-2">
              <Label htmlFor="data-inicio">Período De</Label>
              <Input
                id="data-inicio"
                type="date"
                value={filters.dataInicio}
                onChange={(e) => handleChange('dataInicio', e.target.value)}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3 space-y-2">
              <Label htmlFor="data-fim">Até</Label>
              <Input
                id="data-fim"
                type="date"
                value={filters.dataFim}
                onChange={(e) => handleChange('dataFim', e.target.value)}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <Button onClick={handleClearFilters} variant="ghost" className="w-full md:w-auto">
                Limpar Filtros
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
