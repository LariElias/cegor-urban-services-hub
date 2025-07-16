
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Phone, Mail } from 'lucide-react';
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
import { FiscalForm } from '@/components/forms/FiscalForm';
import { useAuth } from '@/context/AuthContext';
import { isCegorGestor, isCegorOperador, isRegionalGestor } from '@/types';

// Mock data
const mockFiscais = [
  {
    id: '1',
    codigo: 'FIS001',
    nome: 'João Silva',
    cpf: '123.456.789-00',
    email: 'joao.silva@regional.gov.br',
    telefone: '(31) 99999-1234',
    regional_id: '1',
    regional_nome: 'Centro-Sul',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    codigo: 'FIS002',
    nome: 'Maria Santos',
    cpf: '987.654.321-00',
    email: 'maria.santos@regional.gov.br',
    telefone: '(31) 99999-5678',
    regional_id: '2',
    regional_nome: 'Norte',
    created_at: '2024-01-16T14:30:00Z',
  },
];

const Fiscais = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegional, setSelectedRegional] = useState('');
  const [selectedFiscal, setSelectedFiscal] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const canEdit = isCegorGestor(user) || isCegorOperador(user) || isRegionalGestor(user);
  const canCreate = canEdit;
  const showRegionalFilter = isCegorGestor(user) || isCegorOperador(user);

  // Filter fiscais based on user permissions
  const filteredFiscais = mockFiscais.filter(fiscal => {
    // If regional user, only show their regional's fiscais
    if (user?.role === 'regional' && user.regional_id !== fiscal.regional_id) {
      return false;
    }

    const matchesSearch = fiscal.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fiscal.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fiscal.cpf.includes(searchTerm);
    const matchesRegional = !selectedRegional || fiscal.regional_id === selectedRegional;
    
    return matchesSearch && matchesRegional;
  });

  const handleEdit = (fiscal) => {
    setSelectedFiscal(fiscal);
    setIsFormOpen(true);
  };

  const handleNew = () => {
    setSelectedFiscal(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedFiscal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fiscais</h1>
          <p className="text-muted-foreground">Gerencie os fiscais cadastrados</p>
        </div>
        {canCreate && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNew}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Fiscal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedFiscal ? 'Editar Fiscal' : 'Novo Fiscal'}
                </DialogTitle>
              </DialogHeader>
              <FiscalForm
                fiscal={selectedFiscal}
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
                  placeholder="Buscar fiscais..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {showRegionalFilter && (
              <div className="w-48">
                <select
                  value={selectedRegional}
                  onChange={(e) => setSelectedRegional(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="">Todas as Regionais</option>
                  <option value="1">Centro-Sul</option>
                  <option value="2">Norte</option>
                </select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Fiscais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Contato</TableHead>
                  {showRegionalFilter && <TableHead>Regional</TableHead>}
                  <TableHead>Data Criação</TableHead>
                  {canEdit && <TableHead className="text-right">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiscais.map((fiscal) => (
                  <TableRow key={fiscal.id}>
                    <TableCell className="font-medium">{fiscal.codigo}</TableCell>
                    <TableCell>{fiscal.nome}</TableCell>
                    <TableCell>{fiscal.cpf}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {fiscal.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {fiscal.telefone}
                        </div>
                      </div>
                    </TableCell>
                    {showRegionalFilter && (
                      <TableCell>{fiscal.regional_nome}</TableCell>
                    )}
                    <TableCell>
                      {new Date(fiscal.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    {canEdit && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(fiscal)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
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

export default Fiscais;
