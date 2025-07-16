
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
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
import { RegionalForm } from '@/components/forms/RegionalForm';
import { useAuth } from '@/context/AuthContext';
import { Regional } from '@/types';

export default function Regionais() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRegional, setEditingRegional] = useState<Regional | null>(null);

  // Mock data - em produção viria da API
  const [regionais, setRegionais] = useState<Regional[]>([
    {
      id: '1',
      name: 'Centro-Sul',
      code: 'CS',
      address: 'Rua das Flores, 123',
      phone: '(31) 3333-4444',
      responsible: 'João Silva',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Norte',
      code: 'NT',
      address: 'Av. Norte, 456',
      phone: '(31) 3555-6666',
      responsible: 'Maria Santos',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const filteredRegionais = regionais.filter(regional =>
    regional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    regional.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingRegional(null);
    setShowForm(true);
  };

  const handleEdit = (regional: Regional) => {
    setEditingRegional(regional);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta regional?')) {
      setRegionais(regionais.filter(r => r.id !== id));
    }
  };

  const handleSave = (regionalData: Omit<Regional, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingRegional) {
      setRegionais(regionais.map(r => 
        r.id === editingRegional.id 
          ? { ...r, ...regionalData, updated_at: new Date().toISOString() }
          : r
      ));
    } else {
      const newRegional: Regional = {
        ...regionalData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setRegionais([...regionais, newRegional]);
    }
    setShowForm(false);
  };

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
        <h1 className="text-3xl font-bold">Regionais</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Regional
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Regionais</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar regionais..."
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
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegionais.map((regional) => (
                <TableRow key={regional.id}>
                  <TableCell className="font-medium">{regional.code}</TableCell>
                  <TableCell>{regional.name}</TableCell>
                  <TableCell>{regional.address}</TableCell>
                  <TableCell>{regional.phone}</TableCell>
                  <TableCell>{regional.responsible}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(regional)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(regional.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showForm && (
        <RegionalForm
          regional={editingRegional}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
