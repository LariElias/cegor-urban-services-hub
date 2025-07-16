
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { TerritorioForm } from '@/components/forms/TerritorioForm';
import { useAuth } from '@/context/AuthContext';
import { isCegorGestor, isCegorOperador, isRegionalGestor } from '@/types';

// Mock data
const mockTerritórios = [
  {
    id: '1',
    codigo: 'TER001',
    nome: 'Território Centro',
    descricao: 'Área central da cidade',
    bairros: ['Centro', 'Savassi'],
    regional_id: '1',
    regional_nome: 'Centro-Sul',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    codigo: 'TER002',
    nome: 'Território Norte',
    descricao: 'Região norte da cidade',
    bairros: ['Pampulha', 'São Luiz'],
    regional_id: '2',
    regional_nome: 'Norte',
    created_at: '2024-01-16T14:30:00Z',
  },
];

const Territorios = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegional, setSelectedRegional] = useState('');
  const [selectedTerritorio, setSelectedTerritorio] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const canEdit = isCegorGestor(user) || isCegorOperador(user) || isRegionalGestor(user);
  const canCreate = canEdit;
  const showRegionalFilter = isCegorGestor(user) || isCegorOperador(user);

  // Filter territories based on user permissions
  const filteredTerritórios = mockTerritórios.filter(territorio => {
    // If regional user, only show their regional's territories
    if (user?.role === 'regional' && user.regional_id !== territorio.regional_id) {
      return false;
    }

    const matchesSearch = territorio.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         territorio.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegional = !selectedRegional || territorio.regional_id === selectedRegional;
    
    return matchesSearch && matchesRegional;
  });

  const handleEdit = (territorio) => {
    setSelectedTerritorio(territorio);
    setIsFormOpen(true);
  };

  const handleNew = () => {
    setSelectedTerritorio(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedTerritorio(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Territórios</h1>
          <p className="text-muted-foreground">Gerencie os territórios cadastrados</p>
        </div>
        {canCreate && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNew}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Território
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedTerritorio ? 'Editar Território' : 'Novo Território'}
                </DialogTitle>
              </DialogHeader>
              <TerritorioForm
                territorio={selectedTerritorio}
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
                  placeholder="Buscar territórios..."
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
          <CardTitle>Lista de Territórios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Bairros</TableHead>
                  {showRegionalFilter && <TableHead>Regional</TableHead>}
                  <TableHead>Data Criação</TableHead>
                  {canEdit && <TableHead className="text-right">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTerritórios.map((territorio) => (
                  <TableRow key={territorio.id}>
                    <TableCell className="font-medium">{territorio.codigo}</TableCell>
                    <TableCell>{territorio.nome}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {territorio.bairros.map((bairro, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {bairro}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    {showRegionalFilter && (
                      <TableCell>{territorio.regional_nome}</TableCell>
                    )}
                    <TableCell>
                      {new Date(territorio.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    {canEdit && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(territorio)}
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

export default Territorios;
