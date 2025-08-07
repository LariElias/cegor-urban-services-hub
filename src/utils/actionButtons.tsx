import React, { useState } from 'react';
import { Eye, Camera, FileText, CheckCircle, Send, Play, Edit, Calendar, Building, Users, Pause, CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Dialog / Select (ajuste paths se necessário)
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

type OnActionFn = (id: string, payload?: any) => void;

const buttonProps = {
  variant: "outline" as const,
  size: "icon" as const,
  className: "w-8 h-8"
};

/* ----------------- Direcionar (já existente) ----------------- */
const DirecionarOcorrenciaButton: React.FC<{
  ocorrenciaId: string;
  equipes?: string[];
  onConfirm?: (ocorrenciaId: string, equipe: string) => void;
}> = ({ ocorrenciaId, equipes = [], onConfirm }) => {
  const [open, setOpen] = useState(false);
  const [selectedEquipe, setSelectedEquipe] = useState<string>('');

  const handleConfirm = () => {
    if (!selectedEquipe) {
      console.warn('Selecione uma equipe antes de confirmar.');
      return;
    }
    onConfirm?.(ocorrenciaId, selectedEquipe);
    setOpen(false);
    setSelectedEquipe('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button {...buttonProps} title="Direcionar Equipe" className="text-purple-600 hover:text-purple-700">
          <Users className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Direcionar Ocorrência</DialogTitle>
          <DialogDescription>Selecione a equipe que ficará responsável por esta ocorrência.</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Equipe</label>
          <Select onValueChange={(val) => setSelectedEquipe(val)} value={selectedEquipe || undefined}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma equipe..." />
            </SelectTrigger>
            <SelectContent>
              {equipes.length === 0 ? (
                <SelectItem value="">--- Nenhuma equipe disponível ---</SelectItem>
              ) : (
                equipes.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)
              )}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="mt-6 flex justify-end space-x-2">
          <Button variant="ghost" onClick={() => { setOpen(false); setSelectedEquipe(''); }}>Cancelar</Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ----------------- Pausar Execução ----------------- */
const PausarExecucaoButton: React.FC<{
  ocorrenciaId: string;
  onConfirm?: (id: string) => void;
}> = ({ ocorrenciaId, onConfirm }) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm?.(ocorrenciaId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button {...buttonProps} title="Pausar Execução" className="text-blue-600 hover:text-blue-700">
          <Pause className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Pausar Ocorrência</DialogTitle>
          <DialogDescription>
            Deseja pausar essa ocorrência?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex justify-end space-x-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ----------------- Retomar Ocorrência ----------------- */
const RetomarOcorrenciaButton: React.FC<{
  ocorrenciaId: string;
  currentEquipe?: string | null;
  onConfirm?: (id: string, equipe?: string | null) => void;
}> = ({ ocorrenciaId, currentEquipe = null, onConfirm }) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm?.(ocorrenciaId, currentEquipe);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button {...buttonProps} title="Retomar Execução" className="text-blue-600 hover:text-blue-700">
          <Play className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Retomar Ocorrência</DialogTitle>
          <DialogDescription>
            {currentEquipe
              ? `Ao confirmar a ocorrência será retomada pela equipe ${currentEquipe}.`
              : 'Ao confirmar a ocorrência será retomada pela equipe responsável.'}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex justify-end space-x-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ----------------- getActionButton (export) ----------------- */
export const getActionButton = (
  action: string,
  ocorrenciaId: string,
  onAction?: OnActionFn,
  options?: { equipes?: string[]; currentEquipe?: string | null }
) => {
  switch (action) {
    case 'visualizar':
      return (
        <Button key={action} {...buttonProps} asChild title="Visualizar">
          <Link to={`/ocorrencias/${ocorrenciaId}/visualizar`}>
            <Eye className="w-4 h-4" />
          </Link>
        </Button>
      );

    case 'andamento_vistoria':
      return (
        <Button key={action} {...buttonProps} asChild title="Andamento da Vistoria">
          <Link to={`/ocorrencias/${ocorrenciaId}/acompanhamento`}>
            <FileText className="w-4 h-4" />
          </Link>
        </Button>
      );

    case 'realizar_vistoria':
      return (
        <Button key={action} {...buttonProps} asChild title="Realizar Vistoria">
          <Link to={`/ocorrencias/${ocorrenciaId}/vistoria`}>
            <Camera className="w-4 h-4" />
          </Link>
        </Button>
      );

    case 'permitir_execucao':
      return (
        <Button
          key={action}
          {...buttonProps}
          onClick={() => onAction?.(ocorrenciaId)}
          title="Permitir Execução"
          className="text-green-600 hover:text-green-700"
        >
          <Building className="w-4 h-4" />
        </Button>
      );

    case 'direcionar_ocorrencia':
      return (
        <DirecionarOcorrenciaButton
          key={action}
          ocorrenciaId={ocorrenciaId}
          equipes={options?.equipes}
          onConfirm={(id, equipe) => onAction?.(id, { equipe })}
        />
      );

    case 'acompanhamento':
      return (
        <Button key={action} {...buttonProps} asChild title="Acompanhamento">
          <Link to={`/ocorrencias/${ocorrenciaId}/acompanhamento`}>
            <FileText className="w-4 h-4" />
          </Link>
        </Button>
      );

    case 'encaminhar':
      return (
        <Button
          key={action}
          {...buttonProps}
          onClick={() => onAction?.(ocorrenciaId)}
          title="Encaminhar"
          className="text-blue-600 hover:text-blue-700"
        >
          <Send className="w-4 h-4" />
        </Button>
      );

    case 'pausar_execucao':
      return (
        <PausarExecucaoButton
          key={action}
          ocorrenciaId={ocorrenciaId}
          onConfirm={(id) => onAction?.(id, { paused: true })}
        />
      );

    case 'retomar_ocorrencia':
      return (
        <RetomarOcorrenciaButton
          key={action}
          ocorrenciaId={ocorrenciaId}
          currentEquipe={options?.currentEquipe ?? null}
          onConfirm={(id, equipe) => onAction?.(id, { resumed: true, equipe })}
        />
      );

    case 'realizar_vistoria_supervisor':
      return (
        <Button key={action} {...buttonProps} asChild title="Realizar Vistoria">
          <Link to={`/ocorrencias/${ocorrenciaId}/vistoria_final`}>
            <CircleCheck className="w-4 h-4"  />
          </Link>
        </Button>
      );

    default:
      return null;
  }
};
