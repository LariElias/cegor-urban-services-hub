
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface EmpresaFormProps {
  empresa?: any;
  onClose: () => void;
}

export const EmpresaForm = ({ empresa, onClose }: EmpresaFormProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    codigo: empresa?.codigo || '',
    nome: empresa?.nome || '',
    cnpj: empresa?.cnpj || '',
    email: empresa?.email || '',
    telefone: empresa?.telefone || '',
    endereco: empresa?.endereco || '',
    responsavel: empresa?.responsavel || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.codigo || !formData.nome || !formData.cnpj || !formData.email || !formData.responsavel) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // CNPJ validation
    const cnpjNumbers = formData.cnpj.replace(/\D/g, '');
    if (cnpjNumbers.length !== 14) {
      toast({
        title: "Erro",
        description: "CNPJ deve ter 14 dígitos",
        variant: "destructive",
      });
      return;
    }

    console.log('Salvando empresa:', formData);
    
    toast({
      title: "Sucesso",
      description: `Empresa ${empresa ? 'atualizada' : 'criada'} com sucesso!`,
    });
    
    onClose();
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 14);
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
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
            placeholder="EMP001"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nome">Nome *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Empresa Ltda"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ *</Label>
          <Input
            id="cnpj"
            value={formData.cnpj}
            onChange={(e) => setFormData({ ...formData, cnpj: formatCNPJ(e.target.value) })}
            placeholder="12.345.678/0001-90"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="responsavel">Responsável *</Label>
          <Input
            id="responsavel"
            value={formData.responsavel}
            onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
            placeholder="João Silva"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="contato@empresa.com.br"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: formatPhone(e.target.value) })}
            placeholder="(31) 3333-4444"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="endereco">Endereço</Label>
        <Input
          id="endereco"
          value={formData.endereco}
          onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
          placeholder="Rua das Empresas, 100"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          {empresa ? 'Atualizar' : 'Criar'} Empresa
        </Button>
      </div>
    </form>
  );
};
