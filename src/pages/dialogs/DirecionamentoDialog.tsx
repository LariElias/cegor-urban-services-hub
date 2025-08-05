// src/components/ocorrencias/DirecionamentoDialog.tsx

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Ocorrencia } from '@/types';

// Tipos para as props do componente
interface DirecionamentoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { equipeId: string; fiscalId: string; observacoes: string }) => void;
  ocorrencia: Ocorrencia | null;
  equipes: string[]; // Lista de nomes de equipes
  fiscais: { id: string; name: string }[]; // Lista de fiscais disponíveis
}

export function DirecionamentoDialog({
  isOpen,
  onClose,
  onConfirm,
  ocorrencia,
  equipes,
  fiscais,
}: DirecionamentoDialogProps) {
  const [selectedEquipe, setSelectedEquipe] = useState('');
  const [selectedFiscal, setSelectedFiscal] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Reseta o formulário quando o dialog é aberto para uma nova ocorrência
  useEffect(() => {
    if (isOpen) {
      setSelectedEquipe('');
      setSelectedFiscal('');
      setObservacoes('');
    }
  }, [isOpen]);

  const handleConfirmClick = () => {
    if (selectedEquipe && selectedFiscal) {
      onConfirm({
        equipeId: selectedEquipe,
        fiscalId: selectedFiscal,
        observacoes,
      });
    } else {
      // Opcional: Adicionar feedback ao usuário se os campos não forem preenchidos
      alert('Por favor, selecione uma equipe e um fiscal.');
    }
  };

  if (!ocorrencia) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Direcionar Ocorrência</DialogTitle>
          <DialogDescription>
            Protocolo: <span className="font-semibold">{ocorrencia.protocol}</span>. Selecione a equipe e o fiscal para esta demanda.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="equipe" className="text-right">
              Equipe
            </Label>
            <Select value={selectedEquipe} onValueChange={setSelectedEquipe}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione uma equipe" />
              </SelectTrigger>
              <SelectContent>
                {equipes.map((equipe) => (
                  <SelectItem key={equipe} value={equipe}>
                    {equipe}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fiscal" className="text-right">
              Fiscal
            </Label>
            <Select value={selectedFiscal} onValueChange={setSelectedFiscal}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione um fiscal" />
              </SelectTrigger>
              <SelectContent>
                {fiscais.map((fiscal) => (
                  <SelectItem key={fiscal.id} value={fiscal.id}>
                    {fiscal.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="observacoes" className="text-right">
              Observações
            </Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="col-span-3"
              placeholder="Adicione informações relevantes para a equipe..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmClick}>Direcionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}