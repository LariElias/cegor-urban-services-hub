
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface FiscalFormProps {
  fiscal?: any;
  onClose: () => void;
}

export const FiscalForm = ({ fiscal, onClose }: FiscalFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    codigo: fiscal?.codigo || '',
    nome: fiscal?.nome || '',
    cpf: fiscal?.cpf || '',
    email: fiscal?.email || '',
    telefone: fiscal?.telefone || '',
    regional_id: fiscal?.regional_id || user?.regional_id || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.codigo || !formData.nome || !formData.cpf || !formData.email || !formData.regional_id) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // CPF validation
    const cpfNumbers = formData.cpf.replace(/\D/g, '');
    if (cpfNumbers.length !== 11) {
      toast({
        title: "Erro",
        description: "CPF deve ter 11 dígitos",
        variant: "destructive",
      });
      return;
    }

    console.log('Salvando fiscal:', formData);
    
    toast({
      title: "Sucesso",
      description: `Fiscal ${fiscal ? 'atualizado' : 'criado'} com sucesso!`,
    });
    
    onClose();
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
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
            placeholder="FIS001"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nome">Nome *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="João Silva"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            value={formData.cpf}
            onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
            placeholder="123.456.789-00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: formatPhone(e.target.value) })}
            placeholder="(31) 99999-1234"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="fiscal@regional.gov.br"
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

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          {fiscal ? 'Atualizar' : 'Criar'} Fiscal
        </Button>
      </div>
    </form>
  );
};
