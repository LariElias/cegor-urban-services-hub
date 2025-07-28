
import React, { useState } from 'react';
import { CheckCircle, Eye, Search, Check } from 'lucide-react';
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

export default function DemandasEmpresa() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - em produção viria da API
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([
    {
      id: '3',
      protocol: 'OCR-2024-003',
      description: 'Poda de árvores',
      service_type: 'Conservação',
      public_equipment_name: 'Praça Central',
      priority: 'baixa',
      status: 'concluida',
      address: 'Praça Central, s/n',
      regional_id: '1',
      fiscal_id: '1',
      empresa_id: '1',
      completed_at: new Date().toISOString(),
      company_confirmed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '5',
      protocol: 'OCR-2024-005',
      description: 'Limpeza de praça',
      service_type: 'Limpeza',
      public_equipment_name: 'Praça da Liberdade',
      priority: 'media',
      status: 'em_execucao',
      address: 'Praça da Liberdade, s/n',
      regional_id: '1',
      fiscal_id: '1',
      empresa_id: '1',
      started_at: new Date().toISOString(),
      company_confirmed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'autorizada': return 'bg-purple-100 text-purple-800';
      case 'agendada': return 'bg-blue-100 text-blue-800';
      case 'em_execucao': return 'bg-yellow-100 text-yellow-800';
      case 'concluida': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'autorizada': return 'Autorizada';
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

  const handleConfirmCompletion = (id: string) => {
    setOcorrencias(ocorrencias.map(o => 
      o.id === id 
        ? { 
            ...o, 
            company_confirmed: true,
            updated_at: new Date().toISOString()
          }
        : o
    ));
  };

  const filteredOcorrencias = ocorrencias.filter(ocorrencia => {
    const matchesSearch = ocorrencia.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ocorrencia.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Empresa só vê suas próprias demandas
    return matchesSearch && ocorrencia.empresa_id === '1'; // Mock empresa ID
  });

  // Verificar permissões
  if (user?.role !== 'empresa') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Acesso negado. Apenas empresas podem acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Demandas da Empresa</h1>
        <p className="text-muted-foreground">
          Serviços atribuídos à sua empresa
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Demandas</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar demandas..."
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
                <TableHead>Confirmada</TableHead>
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
                  <TableCell>
                    {ocorrencia.company_confirmed ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Confirmada
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Pendente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{ocorrencia.address}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {ocorrencia.status === 'concluida' && !ocorrencia.company_confirmed && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConfirmCompletion(ocorrencia.id)}
                          title="Confirmar Conclusão"
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
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
              <p>Nenhuma demanda encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
