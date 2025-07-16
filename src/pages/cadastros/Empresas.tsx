
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EmpresaForm } from '@/components/forms/EmpresaForm';
import { useAuth } from '@/context/AuthContext';
import { isCegorGestor, isCegorOperador } from '@/types';
import { useNavigate } from 'react-router-dom';

// Mock data
const mockEmpresas = [
  {
    id: '1',
    codigo: 'EMP001',
    nome: 'Limpeza BH Ltda',
    cnpj: '12.345.678/0001-90',
    email: 'contato@limpezabh.com.br',
    telefone: '(31) 3333-4444',
    endereco: 'Rua das Empresas, 100',
    responsavel: 'Carlos Silva',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    codigo: 'EMP002',
    nome: 'Verde Cidade S/A',
    cnpj: '98.765.432/0001-01',
    email: 'contato@verdecidade.com.br',
    telefone: '(31) 3333-5555',
    endereco: 'Av. Verde, 200',
    responsavel: 'Ana Santos',
    created_at: '2024-01-16T14:30:00Z',
  },
];

const Empresas = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const canEdit = isCegorGestor(user) || isCegorOperador(user);
  const canCreate = canEdit;

  // Filter empresas
  const filteredEmpresas = mockEmpresas.filter(empresa => {
    const matchesSearch = empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empresa.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empresa.cnpj.includes(searchTerm);
    
    return matchesSearch;
  });

  const handleEdit = (empresa) => {
    setSelectedEmpresa(empresa);
    setIsFormOpen(true);
  };

  const handleNew = () => {
    setSelectedEmpresa(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedEmpresa(null);
  };

  const handleViewDemandas = (empresaId: string) => {
    navigate(`/empresas/${empresaId}/demandas`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Empresas Contratadas</h1>
          <p className="text-muted-foreground">Gerencie as empresas contratadas</p>
        </div>
        {canCreate && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNew}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Empresa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedEmpresa ? 'Editar Empresa' : 'Nova Empresa'}
                </DialogTitle>
              </DialogHeader>
              <EmpresaForm
                empresa={selectedEmpresa}
                onClose={handleFormClose}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar empresas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Empresas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Data Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmpresas.map((empresa) => (
                  <TableRow key={empresa.id}>
                    <TableCell className="font-medium">{empresa.codigo}</TableCell>
                    <TableCell>{empresa.nome}</TableCell>
                    <TableCell>{empresa.cnpj}</TableCell>
                    <TableCell>{empresa.responsavel}</TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>{empresa.email}</div>
                        <div>{empresa.telefone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(empresa.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDemandas(empresa.id)}
                          title="Ver Demandas"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {canEdit && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(empresa)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Empresas;
