
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RegionalForm } from '@/components/forms/RegionalForm';

// Mock data - em produção viria de uma API
const mockRegionais = [
  {
    id: 1,
    sigla: 'REG01',
    descricao: 'Regional Centro',
    endereco: 'Rua das Flores, 123 - Centro',
    cpfSecretario: '123.456.789-00'
  },
  {
    id: 2,
    sigla: 'REG02',
    descricao: 'Regional Norte',
    endereco: 'Av. Principal, 456 - Norte',
    cpfSecretario: '987.654.321-00'
  }
];

const Regionais = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [regionais, setRegionais] = useState(mockRegionais);
  const [showForm, setShowForm] = useState(false);
  const [editingRegional, setEditingRegional] = useState<any>(null);

  // Verificar permissões
  if (!user || user.role !== 'cegor') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Acesso negado. Apenas usuários CEGOR podem acessar esta página.</p>
      </div>
    );
  }

  const filteredRegionais = regionais.filter(regional =>
    regional.sigla.toLowerCase().includes(searchTerm.toLowerCase()) ||
    regional.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (regional: any) => {
    setEditingRegional(regional);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta regional?')) {
      setRegionais(regionais.filter(r => r.id !== id));
    }
  };

  const handleSave = (data: any) => {
    if (editingRegional) {
      // Editar
      setRegionais(regionais.map(r => 
        r.id === editingRegional.id ? { ...data, id: editingRegional.id } : r
      ));
    } else {
      // Criar novo
      setRegionais([...regionais, { ...data, id: Date.now() }]);
    }
    setShowForm(false);
    setEditingRegional(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Regionais</h1>
        <Button
          onClick={() => {
            setEditingRegional(null);
            setShowForm(true);
          }}
          className="bg-[#0B5CF0] hover:bg-[#0B5CF0]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Regional
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar Regionais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Buscar por sigla ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRegionais.map((regional) => (
          <Card key={regional.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{regional.sigla}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Descrição:</strong> {regional.descricao}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Endereço:</strong> {regional.endereco}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>CPF Secretário:</strong> {regional.cpfSecretario}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(regional)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(regional.id)}
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

      {filteredRegionais.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma regional encontrada.</p>
        </div>
      )}

      {showForm && (
        <RegionalForm
          regional={editingRegional}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingRegional(null);
          }}
        />
      )}
    </div>
  );
};

export default Regionais;
