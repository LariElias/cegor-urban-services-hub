
import React from 'react';
import { Eye, Camera, FileText, CheckCircle, Send, Play, Edit, Calendar, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const getActionButton = (action: string, ocorrenciaId: string, onAction?: (id: string) => void) => {
  const buttonProps = {
    key: action,
    variant: "outline" as const,
    size: "icon" as const,
    className: "w-8 h-8"
  };

  switch (action) {
    case 'visualizar':
      return (
        <Button {...buttonProps} asChild title="Visualizar">
          <Link to={`/ocorrencias/${ocorrenciaId}`}>
            <Eye className="w-4 h-4" />
          </Link>
        </Button>
      );

    case 'andamento_vistoria':
      return (
        <Button {...buttonProps} asChild title="Andamento da Vistoria">
          <Link to={`/ocorrencias/${ocorrenciaId}/acompanhamento`}>
            <FileText className="w-4 h-4" />
          </Link>
        </Button>
      );

    case 'realizar_vistoria':
      return (
        <Button {...buttonProps} asChild title="Realizar Vistoria">
          <Link to={`/ocorrencias/${ocorrenciaId}/vistoria`}>
            <Camera className="w-4 h-4" />
          </Link>
        </Button>
      );

    case 'permitir_execucao':
      return (
        <Button 
          {...buttonProps} 
          onClick={() => onAction?.(ocorrenciaId)} 
          title="Permitir Execução"
          className="text-green-600 hover:text-green-700"
        >
          <Building className="w-4 h-4" />
        </Button>
      );

    case 'agendar_ocorrencia':
      return (
        <Button 
          {...buttonProps} 
          onClick={() => onAction?.(ocorrenciaId)} 
          title="Agendar Ocorrência"
        >
          <Calendar className="w-4 h-4" />
        </Button>
      );

    case 'detalhar_execucao':
      return (
        <Button {...buttonProps} asChild title="Detalhar Execução">
          <Link to={`/ocorrencias/${ocorrenciaId}/detalhamento`}>
            <Edit className="w-4 h-4" />
          </Link>
        </Button>
      );

    case 'acompanhamento':
      return (
        <Button {...buttonProps} asChild title="Acompanhamento">
          <Link to={`/ocorrencias/${ocorrenciaId}/acompanhamento`}>
            <FileText className="w-4 h-4" />
          </Link>
        </Button>
      );

    case 'encaminhar':
      return (
        <Button 
          {...buttonProps} 
          onClick={() => onAction?.(ocorrenciaId)} 
          title="Encaminhar"
          className="text-blue-600 hover:text-blue-700"
        >
          <Send className="w-4 h-4" />
        </Button>
      );

    case 'encerrar_ocorrencia':
      return (
        <Button {...buttonProps} asChild title="Encerrar Ocorrência">
          <Link to={`/ocorrencias/${ocorrenciaId}/vistoria_final`}>
            <CheckCircle className="w-4 h-4" />
          </Link>
        </Button>
      );

    default:
      return null;
  }
};
