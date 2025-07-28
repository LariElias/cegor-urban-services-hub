
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface TerritorioFormProps {
  territorio?: any;
  onClose?: () => void;
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

export const TerritorioForm = ({ territorio, onClose, onSave, onCancel }: TerritorioFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    codigo: territorio?.codigo || '',
    nome: territorio?.nome || '',
    descricao: territorio?.descricao || '',
    bairros: territorio?.bairros || [],
    regional_id: territorio?.regional_id || user?.regional_id || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.codigo || !formData.nome || !formData.regional_id) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    console.log('Salvando território:', formData);
    
    toast({
      title: "Sucesso",
      description: `Território ${territorio ? 'atualizado' : 'criado'} com sucesso!`,
    });
    
    // Call the appropriate callback
    if (onSave) {
      onSave(formData);
    } else if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="codigo">Código *</Label>
          <Input
            id="codigo"
            value={formData.codigo}
            onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
            placeholder="TER001"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nome">Nome *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Território Centro"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          placeholder="Descrição do território"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="regional">Regional *</Label>
        <select
          id="regional"
          value={formData.regional_id}
          onChange={(e) => setFormData({ ...formData, regional_id: e.target.value })}
          className="w-full h-10 px-3 rounded-md border border-input bg-background"
          disabled={user?.role === 'regional'}
        >
          <option value="">Selecione uma regional</option>
          <option value="1">Centro-Sul</option>
          <option value="2">Norte</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label>Bairros</Label>
        <div className="grid grid-cols-3 gap-2">
          {['Centro', 'Savassi', 'Funcionários', 'Pampulha', 'São Luiz', 'Venda Nova'].map((bairro) => (
            <label key={bairro} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.bairros.includes(bairro)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({ ...formData, bairros: [...formData.bairros, bairro] });
                  } else {
                    setFormData({ 
                      ...formData, 
                      bairros: formData.bairros.filter(b => b !== bairro) 
                    });
                  }
                }}
                className="rounded border-input"
              />
              <span className="text-sm">{bairro}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {territorio ? 'Atualizar' : 'Criar'} Território
        </Button>
      </div>
    </form>
  );
};
