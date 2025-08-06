
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface Equipe {
  id: string;
  nome: string;
  regional: string;
  status: 'em_campo' | 'disponivel' | 'manutencao';
  localizacao: string;
  ocorrencia_atual?: {
    protocolo: string;
    tipo: string;
    inicio: string;
  };
  membros: number;
}

const mockEquipes: Equipe[] = [
  {
    id: '1',
    nome: 'Equipe Alpha',
    regional: 'Centro-Sul',
    status: 'em_campo',
    localizacao: 'Rua da Bahia, 1200',
    ocorrencia_atual: {
      protocolo: 'OCR-2024-001',
      tipo: 'Limpeza de via pública',
      inicio: '08:30'
    },
    membros: 4
  },
  {
    id: '2',
    nome: 'Equipe Beta',
    regional: 'Noroeste',
    status: 'em_campo',
    localizacao: 'Av. Antônio Sales, 800',
    ocorrencia_atual: {
      protocolo: 'OCR-2024-002',
      tipo: 'Poda de árvores',
      inicio: '09:15'
    },
    membros: 3
  },
  {
    id: '3',
    nome: 'Equipe Gamma',
    regional: 'Regional 6',
    status: 'disponivel',
    localizacao: 'Base Regional 6',
    membros: 5
  },
  {
    id: '4',
    nome: 'Equipe Delta',
    regional: 'Centro',
    status: 'manutencao',
    localizacao: 'Oficina Central',
    membros: 4
  }
];

export function EquipesEmCampoCard() {
  const [equipes, setEquipes] = useState<Equipe[]>(mockEquipes);
  const [loading, setLoading] = useState(false);

  const atualizarLocalizacoes = async () => {
    setLoading(true);
    // Simular chamada da API
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      em_campo: { label: 'Em Campo', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' },
      disponivel: { label: 'Disponível', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' },
      manutencao: { label: 'Manutenção', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'em_campo':
        return <Users className="w-4 h-4 text-green-600" />;
      case 'disponivel':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'manutencao':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Users className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const equipesEmCampo = equipes.filter(e => e.status === 'em_campo');
  const equipesDisponiveis = equipes.filter(e => e.status === 'disponivel');

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Users className="h-5 w-5" />
              Equipes em Campo
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Status atual das equipes de campo
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={atualizarLocalizacoes}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Resumo */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{equipesEmCampo.length}</div>
            <div className="text-xs text-muted-foreground">Em Campo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{equipesDisponiveis.length}</div>
            <div className="text-xs text-muted-foreground">Disponíveis</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {equipes.filter(e => e.status === 'manutencao').length}
            </div>
            <div className="text-xs text-muted-foreground">Manutenção</div>
          </div>
        </div>

        {/* Lista de equipes */}
        <div className="space-y-3">
          {equipes.map((equipe) => (
            <div 
              key={equipe.id} 
              className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(equipe.status)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-card-foreground">{equipe.nome}</span>
                    {getStatusBadge(equipe.status)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{equipe.localizacao}</span>
                    <span>•</span>
                    <span>{equipe.regional}</span>
                    <span>•</span>
                    <span>{equipe.membros} membros</span>
                  </div>
                  {equipe.ocorrencia_atual && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{equipe.ocorrencia_atual.protocolo} - {equipe.ocorrencia_atual.tipo}</span>
                      <span>•</span>
                      <span>Início: {equipe.ocorrencia_atual.inicio}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
