
import React, { useState } from 'react';
import { CheckCircle, Eye, Search, Calendar } from 'lucide-react';
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

export default function OcorrenciasAprovadas() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - em produção viria da API
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([
    {
      id: '2',
      protocol: 'OCR-2024-002',
      description: 'Reparo em calçada',
      service_type: 'Manutenção',
      public_equipment_name: 'Calçada Av. Brasil',
      priority: 'media',
      status: 'encaminhada',
      address: 'Av. Brasil, 456',
      regional_id: '1',
      fiscal_id: '1',
      forwarded_by: '2',
      forwarded_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      protocol: 'OCR-2024-004',
      description: 'Limpeza de bueiro',
      service_type: 'Limpeza',
      public_equipment_name: 'Bueiro Rua Amazonas',
      priority: 'alta',
      status: 'encaminhada',
      address: 'Rua Amazonas, 789',
      regional_id: '1',
      fiscal_id: '1',
      forwarded_by: '2',
      forwarded_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baixa': return 'bg-green-100 text-green-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'alta': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAgendamento = (id: string) => {
    setOcorrencias(ocorrencias.map(o => 
      o.id === id 
        ? { 
            ...o, 
            status: 'agendada', 
            updated_at: new Date().toISOString()
          }
        : o
    ));
  };

  const filteredOcorrencias = ocorrencias.filter(ocorrencia => {
    const matchesSearch = ocorrencia.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ocorrencia.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Só mostrar ocorrências encaminhadas
    return matchesSearch && ocorrencia.status === 'encaminhada';
  });

  // Verificar permissões
  if (user?.role !== 'cegor') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Acesso negado. Apenas usuários CEGOR podem acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ocorrências Aprovadas</h1>
        <p className="text-muted-foreground">
          Ocorrências encaminhadas pelas regionais aguardando agendamento
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ocorrências Encaminhadas</CardTitle>
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
                <TableHead>Regional</TableHead>
                <TableHead>Encaminhado em</TableHead>
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
                    <Badge variant="outline">Centro-Sul</Badge>
                  </TableCell>
                  <TableCell>
                    {ocorrencia.forwarded_at 
                      ? new Date(ocorrencia.forwarded_at).toLocaleDateString('pt-BR')
                      : '-'
                    }
                  </TableCell>
                  <TableCell>{ocorrencia.address}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link to={`/ocorrencias/${ocorrencia.id}/agendamento`}>
                          <Calendar className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link to={`/ocorrencias/${ocorrencia.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredOcorrencias.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-2" />
              <p>Nenhuma ocorrência encaminhada encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
