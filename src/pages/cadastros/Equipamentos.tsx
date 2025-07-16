
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
import { EquipamentoForm } from '@/components/forms/EquipamentoForm';
import { useAuth } from '@/context/AuthContext';
import { isCegorGestor, isCegorOperador, isRegionalGestor } from '@/types';

// Mock data
const mockEquipamentos = [
  {
    id: '1',
    codigo: 'EQP001',
    nome: 'Praça da Liberdade',
    descricao: 'Praça central histórica',
    tipo: 'Praça',
    endereco: 'Praça da Liberdade, s/n',
    numero: null,
    bairro_nome: 'Centro',
    latitude: -19.9317,
    longitude: -43.9378,
    regional_id: '1',
    regional_nome: 'Centro-Sul',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    codigo: 'EQP002',
    nome: 'Areninha da Pampulha',
    descricao: 'Campo de futebol society',
    tipo: 'Areninha',
    endereco: 'Av. Antônio Carlos, 1000',
    numero: 1000,
    bairro_nome: 'Pampulha',
    latitude: -19.8624,
    longitude: -43.9653,
    regional_id: '2',
    regional_nome: 'Norte',
    created_at: '2024-01-16T14:30:00Z',
  },
];

const Equipamentos = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegional, setSelectedRegional] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedEquipamento, setSelectedEquipamento] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const canEdit = isCegorGestor(user) || isCegorOperador(user) || isRegionalGestor(user);
  const canCreate = canEdit;
  const showRegionalFilter = isCegorGestor(user) || isCegorOperador(user);

  // Filter equipamentos based on user permissions
  const filteredEquipamentos = mockEquipamentos.filter(equipamento => {
    // If regional user, only show their regional's equipamentos
    if (user?.role === 'regional' && user.regional_id !== equipamento.regional_id) {
      return false;
    }

    const matchesSearch = equipamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipamento.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipamento.endereco.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegional = !selectedRegional || equipamento.regional_id === selectedRegional;
    const matchesTipo = !selectedTipo || equipamento.tipo === selectedTipo;
    
    return matchesSearch && matchesRegional && matchesTipo;
  });

  const handleEdit = (equipamento) => {
    setSelectedEquipamento(equipamento);
    setIsFormOpen(true);
  };

  const handleNew = () => {
    setSelectedEquipamento(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedEquipamento(null);
  };

  const getTipoColor = (tipo: string) => {
    const colors = {
      'Praça': 'bg-green-100 text-green-800',
      'Areninha': 'bg-blue-100 text-blue-800',
      'Escola': 'bg-purple-100 text-purple-800',
      'Posto': 'bg-orange-100 text-orange-800',
      'UBS': 'bg-red-100 text-red-800',
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Equipamentos Públicos</h1>
          <p className="text-muted-foreground">Gerencie os equipamentos públicos cadastrados</p>
        </div>
        {canCreate && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNew}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Equipamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedEquipamento ? 'Editar Equipamento' : 'Novo Equipamento'}
                </DialogTitle>
              </DialogHeader>
              <EquipamentoForm
                equipamento={selectedEquipamento}
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
                  placeholder="Buscar equipamentos..."
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
            <div className="w-40">
              <select
                value={selectedTipo}
                onChange={(e) => setSelectedTipo(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="">Todos os Tipos</option>
                <option value="Praça">Praça</option>
                <option value="Areninha">Areninha</option>
                <option value="Escola">Escola</option>
                <option value="Posto">Posto</option>
                <option value="UBS">UBS</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Equipamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Bairro</TableHead>
                  {showRegionalFilter && <TableHead>Regional</TableHead>}
                  <TableHead>Localização</TableHead>
                  {canEdit && <TableHead className="text-right">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipamentos.map((equipamento) => (
                  <TableRow key={equipamento.id}>
                    <TableCell className="font-medium">{equipamento.codigo}</TableCell>
                    <TableCell>{equipamento.nome}</TableCell>
                    <TableCell>
                      <Badge className={getTipoColor(equipamento.tipo)}>
                        {equipamento.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>{equipamento.endereco}</TableCell>
                    <TableCell>{equipamento.bairro_nome}</TableCell>
                    {showRegionalFilter && (
                      <TableCell>{equipamento.regional_nome}</TableCell>
                    )}
                    <TableCell>
                      {equipamento.latitude && equipamento.longitude ? (
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3" />
                          {equipamento.latitude.toFixed(4)}, {equipamento.longitude.toFixed(4)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Não informado</span>
                      )}
                    </TableCell>
                    {canEdit && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(equipamento)}
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

export default Equipamentos;
