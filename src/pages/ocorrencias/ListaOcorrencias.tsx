
import React, { useState } from 'react';
import { Plus, Edit, Eye, Play, Send, CheckCircle, XCircle, Camera, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { Ocorrencia } from '@/types';
import { Link } from 'react-router-dom';

export default function ListaOcorrencias() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - em produção viria da API
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([
    {
      id: '1',
      protocol: 'OCR-2024-001',
      description: 'Limpeza de terreno baldio',
      service_type: 'Limpeza',
      priority: 'alta',
      status: 'criada',
      address: 'Rua das Flores, 123',
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
      priority: 'media',
      status: 'agendada',
      address: 'Av. Brasil, 456',
      regional_id: '1',
      fiscal_id: '1',
      scheduled_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      protocol: 'OCR-2024-003',
      description: 'Poda de árvores',
      service_type: 'Conservação',
      priority: 'baixa',
      status: 'em_execucao',
      address: 'Praça Central, s/n',
      regional_id: '1',
      fiscal_id: '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'criada': return 'bg-gray-100 text-gray-800';
      case 'encaminhada': return 'bg-blue-100 text-blue-800';
      case 'devolvida': return 'bg-red-100 text-red-800';
      case 'em_analise': return 'bg-yellow-100 text-yellow-800';
      case 'agendada': return 'bg-purple-100 text-purple-800';
      case 'em_execucao': return 'bg-orange-100 text-orange-800';
      case 'concluida': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'criada': return 'Criada';
      case 'encaminhada': return 'Encaminhada';
      case 'devolvida': return 'Devolvida';
      case 'em_analise': return 'Em Análise';
      case 'agendada': return 'Agendada';
      case 'em_execucao': return 'Em Execução';
      case 'concluida': return 'Concluída';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baixa': return 'bg-green-100 text-green-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'alta': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (id: string, newStatus: Ocorrencia['status']) => {
    setOcorrencias(ocorrencias.map(o => 
      o.id === id 
        ? { ...o, status: newStatus, updated_at: new Date().toISOString() }
        : o
    ));
  };

  const filteredOcorrencias = ocorrencias.filter(ocorrencia => {
    const matchesSearch = ocorrencia.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ocorrencia.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por permissões
    if (user?.role === 'regional') {
      return matchesSearch && ocorrencia.regional_id === user.regional_id;
    }
    if (user?.role === 'empresa') {
      return matchesSearch && ['agendada', 'em_execucao'].includes(ocorrencia.status);
    }
    return matchesSearch;
  });

  const renderActionButtons = (ocorrencia: Ocorrencia) => {
    const buttons = [];

    // Botões para Regional
    if (user?.role === 'regional') {
      if (ocorrencia.status === 'criada') {
        buttons.push(
          <Button
            key="encaminhar"
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange(ocorrencia.id, 'encaminhada')}
            title="Encaminhar para CEGOR"
          >
            <Send className="w-4 h-4" />
          </Button>
        );
      }
      
      if (ocorrencia.status === 'agendada') {
        buttons.push(
          <Button
            key="executar"
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange(ocorrencia.id, 'em_execucao')}
            title="Iniciar execução"
          >
            <Play className="w-4 h-4" />
          </Button>
        );
      }

      if (ocorrencia.status === 'em_execucao') {
        buttons.push(
          <Button
            key="detalhar"
            variant="outline"
            size="sm"
            asChild
          >
            <Link to={`/ocorrencias/${ocorrencia.id}/detalhamento`}>
              <Edit className="w-4 h-4" />
            </Link>
          </Button>
        );
      }
    }

    // Botões para CEGOR
    if (user?.role === 'cegor') {
      if (ocorrencia.status === 'encaminhada') {
        buttons.push(
          <Button
            key="executar"
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange(ocorrencia.id, 'agendada')}
            title="Executar"
          >
            <CheckCircle className="w-4 h-4" />
          </Button>
        );
        buttons.push(
          <Button
            key="devolver"
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange(ocorrencia.id, 'devolvida')}
            title="Devolver"
          >
            <XCircle className="w-4 h-4" />
          </Button>
        );
      }

      if (ocorrencia.status === 'criada') {
        buttons.push(
          <Button
            key="vistoria"
            variant="outline"
            size="sm"
            asChild
          >
            <Link to={`/ocorrencias/${ocorrencia.id}/vistoria`}>
              <Camera className="w-4 h-4" />
            </Link>
          </Button>
        );
      }
    }

    // Botões para Empresa
    if (user?.role === 'empresa') {
      if (ocorrencia.status === 'em_execucao') {
        buttons.push(
          <Button
            key="acompanhamento"
            variant="outline"
            size="sm"
            asChild
          >
            <Link to={`/ocorrencias/${ocorrencia.id}/acompanhamento`}>
              <FileText className="w-4 h-4" />
            </Link>
          </Button>
        );
      }
    }

    // Botão de visualizar sempre presente
    buttons.push(
      <Button
        key="visualizar"
        variant="outline"
        size="sm"
        asChild
      >
        <Link to={`/ocorrencias/${ocorrencia.id}`}>
          <Eye className="w-4 h-4" />
        </Link>
      </Button>
    );

    return buttons;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ocorrências</h1>
        {user?.role === 'regional' && (
          <Button asChild className="flex items-center gap-2">
            <Link to="/ocorrencias/nova">
              <Plus className="w-4 h-4" />
              Nova Ocorrência
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ocorrências</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar ocorrências..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Protocolo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOcorrencias.map((ocorrencia) => (
                <TableRow key={ocorrencia.id}>
                  <TableCell className="font-medium">{ocorrencia.protocol}</TableCell>
                  <TableCell>{ocorrencia.description}</TableCell>
                  <TableCell>{ocorrencia.service_type}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(ocorrencia.priority)}>
                      {ocorrencia.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ocorrencia.status)}>
                      {getStatusLabel(ocorrencia.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{ocorrencia.address}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {renderActionButtons(ocorrencia)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
