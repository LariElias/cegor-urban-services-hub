import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; // Assumindo que o user vem do contexto

// Helper para obter a lista de status
const getStatusLabel = (status: string) => ({'criada': 'Criada','encaminhada': 'Encaminhada','autorizada': 'Autorizada','cancelada': 'Cancelada','devolvida': 'Devolvida','em_analise': 'Em Análise','agendada': 'Agendada','em_execucao': 'Em Execução','executada': 'Executada', 'concluida': 'Concluída'}[status] || status);

// Tipos para as props do componente
interface Filters {
  searchTerm: string;
  status: string;
  priority: string;
  regional: string;
  bairro: string;
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
    onFilterChange({ [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-4 h-4" /> Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Buscar protocolo ou descrição..."
          value={filters.searchTerm}
          onChange={(e) => handleChange('searchTerm', e.target.value)}
          className="lg:col-span-2"
        />
        
        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">Todos os Status</option>
          {['criada', 'encaminhada', 'autorizada', 'agendada', 'em_execucao', 'executada', 'concluida', 'cancelada', 'devolvida'].map(s => 
            <option key={s} value={s}>{getStatusLabel(s)}</option>
          )}
        </select>
        
        <select
          value={filters.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">Todas as Prioridades</option>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
        
        {/* Filtro de Regional visível apenas para CEGOR ou outros perfis de alto nível */}
        {user?.role === 'cegor' && (
            <select
                value={filters.regional}
                onChange={(e) => handleChange('regional', e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
                <option value="">Todas as Regionais</option>
                {uniqueRegionais.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
        )}

        <select
          value={filters.bairro}
          onChange={(e) => handleChange('bairro', e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">Todos os Bairros</option>
          {uniqueBairros.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </CardContent>
    </Card>
  );
}
