
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BairroForm } from '@/components/forms/BairroForm';

// Mock data - em produção viria de uma API
const mockBairros = [
  {
    id: 1,
    codigo: 'B001',
    nome: 'Centro',
    descricao: 'Bairro central da cidade',
    habitantes: 15000,
    area: 2.5,
    kmVias: 12.8
  },
  {
    id: 2,
    codigo: 'B002',
    nome: 'São José',
    descricao: 'Bairro residencial',
    habitantes: 8500,
    area: 1.8,
    kmVias: 8.2
  }
];

const Bairros = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [bairros, setBairros] = useState(mockBairros);
  const [showForm, setShowForm] = useState(false);
  const [editingBairro, setEditingBairro] = useState<any>(null);

  // Verificar permissões
  if (!user || user.role !== 'cegor') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Acesso negado. Apenas usuários CEGOR podem acessar esta página.</p>
      </div>
    );
  }

  const filteredBairros = bairros.filter(bairro =>
    bairro.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bairro.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (bairro: any) => {
    setEditingBairro(bairro);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este bairro?')) {
      setBairros(bairros.filter(b => b.id !== id));
    }
  };

  const handleSave = (data: any) => {
    if (editingBairro) {
      // Editar
      setBairros(bairros.map(b => 
        b.id === editingBairro.id ? { ...data, id: editingBairro.id } : b
      ));
    } else {
      // Criar novo
      setBairros([...bairros, { ...data, id: Date.now() }]);
    }
    setShowForm(false);
    setEditingBairro(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Bairros</h1>
        <Button
          onClick={() => {
            setEditingBairro(null);
            setShowForm(true);
          }}
          className="bg-[#0B5CF0] hover:bg-[#0B5CF0]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Bairro
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar Bairros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Buscar por código ou nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBairros.map((bairro) => (
          <Card key={bairro.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{bairro.codigo} - {bairro.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Descrição:</strong> {bairro.descricao}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Habitantes:</strong> {bairro.habitantes?.toLocaleString() || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Área:</strong> {bairro.area} km²
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Km de Vias:</strong> {bairro.kmVias} km
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(bairro)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(bairro.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBairros.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum bairro encontrado.</p>
        </div>
      )}

      {showForm && (
        <BairroForm
          bairro={editingBairro}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingBairro(null);
          }}
        />
      )}
    </div>
  );
};

export default Bairros;
