
import React, { useState } from 'react';
import { MapPin, Filter, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { Ocorrencia } from '@/types';
import { Link } from 'react-router-dom';

export default function MapaOcorrencias() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    status: '',
    tipo: '',
    regional: '',
    prioridade: '',
    dataInicio: '',
    dataFim: '',
  });

  // Mock data - em produção viria da API
  const ocorrencias: Ocorrencia[] = [
    {
      id: '1',
      protocol: 'OCR-2024-001',
      description: 'Limpeza de terreno baldio',
      service_type: 'Limpeza',
      public_equipment_name: 'Terreno Rua das Flores',
      priority: 'alta',
      status: 'encaminhada',
      address: 'Rua das Flores, 123',
      latitude: -3.732,
      longitude: -38.527,
      regional_id: '1',
      fiscal_id: '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      protocol: 'OCR-2024-002',
      description: 'Reparo em calçada',
      service_type: 'Manutenção',
      public_equipment_name: 'Calçada Av. Brasil',
      priority: 'media',
      status: 'autorizada',
      address: 'Av. Brasil, 456',
      latitude: -3.735,
      longitude: -38.525,
      regional_id: '1',
      fiscal_id: '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      protocol: 'OCR-2024-003',
      description: 'Poda de árvores',
      service_type: 'Conservação',
      public_equipment_name: 'Praça Central',
      priority: 'baixa',
      status: 'em_execucao',
      address: 'Praça Central, s/n',
      latitude: -3.730,
      longitude: -38.530,
      regional_id: '1',
      fiscal_id: '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'encaminhada': return 'bg-red-500';
      case 'autorizada':
      case 'agendada': return 'bg-orange-500';
      case 'em_execucao': return 'bg-blue-500';
      case 'concluida': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'criada': return 'Criada';
      case 'encaminhada': return 'Encaminhada';
      case 'autorizada': return 'Autorizada';
      case 'cancelada': return 'Cancelada';
      case 'devolvida': return 'Devolvida';
      case 'em_analise': return 'Em Análise';
      case 'agendada': return 'Agendada';
      case 'em_execucao': return 'Em Execução';
      case 'concluida': return 'Concluída';
      default: return status;
    }
  };

  if (user?.role !== 'cegor') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Acesso negado. Apenas usuários CEGOR podem visualizar o mapa.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <MapPin className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Mapa de Ocorrências</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Painel de Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="encaminhada">Encaminhada</SelectItem>
                  <SelectItem value="autorizada">Autorizada</SelectItem>
                  <SelectItem value="agendada">Agendada</SelectItem>
                  <SelectItem value="em_execucao">Em Execução</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tipo">Tipo de Ocorrência</Label>
              <Select value={filters.tipo} onValueChange={(value) => setFilters({...filters, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Limpeza">Limpeza</SelectItem>
                  <SelectItem value="Manutenção">Manutenção</SelectItem>
                  <SelectItem value="Conservação">Conservação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select value={filters.prioridade} onValueChange={(value) => setFilters({...filters, prioridade: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={filters.dataInicio}
                onChange={(e) => setFilters({...filters, dataInicio: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={filters.dataFim}
                onChange={(e) => setFilters({...filters, dataFim: e.target.value})}
              />
            </div>

            <Button className="w-full" onClick={() => setFilters({
              status: '', tipo: '', regional: '', prioridade: '', dataInicio: '', dataFim: ''
            })}>
              Limpar Filtros
            </Button>
          </CardContent>
        </Card>

        {/* Área do Mapa */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Mapa - Fortaleza/CE</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Simulação do mapa - em produção seria um componente Leaflet */}
              <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Mapa será implementado com mapas.fortaleza.ce.gov.br</p>
                    <p className="text-sm text-gray-500">Centro: Fortaleza (-3.732, -38.527)</p>
                  </div>
                </div>

                {/* Simulação de marcadores */}
                {ocorrencias.map((ocorrencia, index) => (
                  <div
                    key={ocorrencia.id}
                    className={`absolute w-4 h-4 rounded-full ${getStatusColor(ocorrencia.status)} cursor-pointer`}
                    style={{
                      left: `${50 + index * 10}%`,
                      top: `${40 + index * 5}%`,
                    }}
                    title={`${ocorrencia.protocol} - ${getStatusLabel(ocorrencia.status)}`}
                  />
                ))}
              </div>

              {/* Legenda */}
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Encaminhada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Autorizada/Agendada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Em Execução</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Concluída</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Ocorrências no Mapa */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ocorrências Visualizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ocorrencias.map((ocorrencia) => (
                  <div key={ocorrencia.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(ocorrencia.status)}`}></div>
                      <div>
                        <p className="font-medium">{ocorrencia.protocol}</p>
                        <p className="text-sm text-muted-foreground">{ocorrencia.description}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {getStatusLabel(ocorrencia.status)}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/ocorrencias/${ocorrencia.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        Abrir
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
