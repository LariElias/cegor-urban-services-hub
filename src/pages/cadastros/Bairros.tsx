
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
import { BairroForm } from '@/components/forms/BairroForm';
import { useAuth } from '@/context/AuthContext';
import { Bairro } from '@/types';

export default function Bairros() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBairro, setEditingBairro] = useState<Bairro | null>(null);

  // Mock data - em produção viria da API
  const [bairros, setBairros] = useState<Bairro[]>([
    {
      id: '1',
      name: 'Centro',
      code: 'CT',
      regional_id: '1',
      regional: {
        id: '1',
        name: 'Centro-Sul',
        code: 'CS',
        address: 'Rua das Flores, 123',
        phone: '(31) 3333-4444',
        responsible: 'João Silva',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const filteredBairros = bairros.filter(bairro =>
    bairro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bairro.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingBairro(null);
    setShowForm(true);
  };

  const handleEdit = (bairro: Bairro) => {
    setEditingBairro(bairro);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este bairro?')) {
      setBairros(bairros.filter(b => b.id !== id));
    }
  };

  const handleSave = (bairroData: Omit<Bairro, 'id' | 'created_at' | 'updated_at' | 'regional'>) => {
    if (editingBairro) {
      setBairros(bairros.map(b => 
        b.id === editingBairro.id 
          ? { ...b, ...bairroData, updated_at: new Date().toISOString() }
          : b
      ));
    } else {
      const newBairro: Bairro = {
        ...bairroData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setBairros([...bairros, newBairro]);
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
        <h1 className="text-3xl font-bold">Bairros</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Bairro
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Bairros</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar bairros..."
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
                <TableHead>Regional</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBairros.map((bairro) => (
                <TableRow key={bairro.id}>
                  <TableCell className="font-medium">{bairro.code}</TableCell>
                  <TableCell>{bairro.name}</TableCell>
                  <TableCell>{bairro.regional?.name || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(bairro)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(bairro.id)}
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
        <BairroForm
          bairro={editingBairro}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
