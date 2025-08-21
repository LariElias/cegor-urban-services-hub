
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface EquipamentoFormProps {
  equipamento?: any;
  onClose?: () => void;
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

export const EquipamentoForm = ({ equipamento, onClose, onSave, onCancel }: EquipamentoFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    codigo: equipamento?.codigo || '',
    nome: equipamento?.nome || '',
    descricao: equipamento?.descricao || '',
    tipo: equipamento?.tipo || '',
    endereco: equipamento?.endereco || '',
    numero: equipamento?.numero || '',
    bairro_id: equipamento?.bairro_id || '',
    cep: equipamento?.cep || '',
    // latitude: equipamento?.latitude || '',
    // longitude: equipamento?.longitude || '',
    regional_id: equipamento?.regional_id || user?.regional_id || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.nome || !formData.tipo || !formData.endereco || !formData.bairro_id || !formData.regional_id) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    console.log('Salvando equipamento:', formData);

    toast({
      title: "Sucesso",
      description: `Equipamento ${equipamento ? 'atualizado' : 'criado'} com sucesso!`,
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
            placeholder="EQP001"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nome">Nome *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Praça da Liberdade"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          placeholder="Descrição do equipamento"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo *</Label>
          <select
            id="tipo"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
          >
            <option value="">Selecione um tipo</option>
            <option value="Praça">Praça</option>
            <option value="Areninha">Areninha</option>
            <option value="Escola">Escola</option>
            <option value="Posto">Posto</option>
            <option value="UBS">UBS</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bairro">Bairro *</Label>
          <select
            id="bairro"
            value={formData.bairro_id}
            onChange={(e) => setFormData({ ...formData, bairro_id: e.target.value })}
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
          >
            <option value="">Selecione um bairro</option>
            <option value="1">Centro</option>
            <option value="2">Savassi</option>
            <option value="3">Funcionários</option>
            <option value="4">Pampulha</option>
            <option value="5">São Luiz</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-2">
          <Label htmlFor="endereco">Endereço *</Label>
          <Input
            id="endereco"
            value={formData.endereco}
            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
            placeholder="Rua das Flores"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="numero">Número</Label>
          <Input
            id="numero"
            type="number"
            value={formData.numero}
            onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
            placeholder="123"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cep">CEP</Label>
        <Input
          id="cep"
          value={formData.cep}
          onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
          placeholder="00000-000"
        />
      </div>

      {/* <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            placeholder="-19.9317"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            placeholder="-43.9378"
          />
        </div>
      </div> */}

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

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {equipamento ? 'Atualizar' : 'Criar'} Equipamento
        </Button>
      </div>
    </form>
  );
};
