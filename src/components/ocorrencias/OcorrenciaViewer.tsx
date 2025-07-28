
import React, { useState } from 'react';
import { X, FileText, Calendar, Clock, User, MapPin, AlertCircle, CheckCircle, XCircle, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Ocorrencia } from '@/types';

interface OcorrenciaViewerProps {
  ocorrencia: Ocorrencia;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusColor = (status: string) => ({
  'criada': 'bg-gray-100 text-gray-800',
  'encaminhada': 'bg-blue-100 text-blue-800',
  'autorizada': 'bg-teal-100 text-teal-800',
  'cancelada': 'bg-red-100 text-red-800',
  'devolvida': 'bg-orange-100 text-orange-800',
  'em_analise': 'bg-yellow-100 text-yellow-800',
  'agendada': 'bg-purple-100 text-purple-800',
  'em_execucao': 'bg-cyan-100 text-cyan-800',
  'executada': 'bg-green-100 text-green-800',
  'concluida': 'bg-emerald-100 text-emerald-800'
}[status] || 'bg-gray-100 text-gray-800');

const getStatusLabel = (status: string) => ({
  'criada': 'Criada',
  'encaminhada': 'Encaminhada',
  'autorizada': 'Autorizada',
  'cancelada': 'Cancelada',
  'devolvida': 'Devolvida',
  'em_analise': 'Em Análise',
  'agendada': 'Agendada',
  'em_execucao': 'Em Execução',
  'executada': 'Executada',
  'concluida': 'Concluída'
}[status] || status);

const getPriorityColor = (priority: string) => ({
  'baixa': 'bg-green-100 text-green-800',
  'media': 'bg-yellow-100 text-yellow-800',
  'alta': 'bg-red-100 text-red-800'
}[priority] || 'bg-gray-100 text-gray-800');

const TimelineItem: React.FC<{
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'cancelled';
}> = ({ date, title, description, status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Pause className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="flex items-start space-x-3 pb-4">
      <div className="flex-shrink-0 mt-1">
        {getStatusIcon()}
      </div>
      <div className="flex-grow">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{title}</span>
          <span className="text-xs text-gray-500">{new Date(date).toLocaleDateString('pt-BR')}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
};

const OcorrenciaViewer: React.FC<OcorrenciaViewerProps> = ({ ocorrencia, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const generateTimeline = () => {
    const events = [];
    
    if (ocorrencia.created_at) {
      events.push({
        date: ocorrencia.created_at,
        title: 'Ocorrência Criada',
        description: 'Ocorrência registrada no sistema',
        status: 'completed' as const
      });
    }

    if (ocorrencia.forwarded_at) {
      events.push({
        date: ocorrencia.forwarded_at,
        title: 'Encaminhada',
        description: 'Ocorrência encaminhada para análise',
        status: 'completed' as const
      });
    }

    if (ocorrencia.approved_at_regional) {
      events.push({
        date: ocorrencia.approved_at_regional,
        title: 'Autorizada pela Regional',
        description: 'Ocorrência autorizada para execução',
        status: 'completed' as const
      });
    }

    if (ocorrencia.vistoria_previa_date) {
      events.push({
        date: ocorrencia.vistoria_previa_date,
        title: 'Vistoria Prévia',
        description: 'Vistoria prévia realizada',
        status: 'completed' as const
      });
    }

    if (ocorrencia.scheduled_date) {
      events.push({
        date: ocorrencia.scheduled_date,
        title: 'Agendamento',
        description: 'Execução agendada',
        status: 'completed' as const
      });
    }

    if (ocorrencia.started_at) {
      events.push({
        date: ocorrencia.started_at,
        title: 'Início da Execução',
        description: 'Execução iniciada',
        status: 'completed' as const
      });
    }

    if (ocorrencia.vistoria_pos_date) {
      events.push({
        date: ocorrencia.vistoria_pos_date,
        title: 'Vistoria Pós-Execução',
        description: 'Vistoria pós-execução realizada',
        status: 'completed' as const
      });
    }

    if (ocorrencia.completed_at) {
      events.push({
        date: ocorrencia.completed_at,
        title: 'Execução Concluída',
        description: 'Execução finalizada',
        status: 'completed' as const
      });
    }

    if (ocorrencia.status === 'cancelada' && ocorrencia.cancel_reason) {
      events.push({
        date: ocorrencia.updated_at,
        title: 'Cancelada',
        description: ocorrencia.cancel_reason,
        status: 'cancelled' as const
      });
    }

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const mockAttachments = [
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg'
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DialogTitle className="text-2xl">Ocorrência {ocorrencia.protocol}</DialogTitle>
                <Badge className={getPriorityColor(ocorrencia.priority)}>
                  {ocorrencia.priority}
                </Badge>
                <Badge className={getStatusColor(ocorrencia.status)}>
                  {getStatusLabel(ocorrencia.status)}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <Tabs defaultValue="dados" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dados">Dados Básicos</TabsTrigger>
              <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
              <TabsTrigger value="anexos">Fotos/Anexos</TabsTrigger>
              <TabsTrigger value="agendamento">Agendamento</TabsTrigger>
              <TabsTrigger value="observacoes">Observações</TabsTrigger>
            </TabsList>

            <TabsContent value="dados" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Informações Gerais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Protocolo</label>
                        <p className="text-sm font-mono">{ocorrencia.protocol}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tipo de Serviço</label>
                        <p className="text-sm">{ocorrencia.service_type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Descrição</label>
                        <p className="text-sm">{ocorrencia.description}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Origem</label>
                        <p className="text-sm">{ocorrencia.origin} {ocorrencia.origin_number && `- ${ocorrencia.origin_number}`}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Endereço</label>
                        <p className="text-sm flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {ocorrencia.address}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Equipamento Público</label>
                        <p className="text-sm">{ocorrencia.public_equipment_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Regional Responsável</label>
                        <p className="text-sm">{ocorrencia.regional?.name || 'Não informado'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Fiscal Designado</label>
                        <p className="text-sm">{ocorrencia.fiscal?.name || 'Não informado'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Histórico da Ocorrência
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {generateTimeline().map((event, index) => (
                      <TimelineItem
                        key={index}
                        date={event.date}
                        title={event.title}
                        description={event.description}
                        status={event.status}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="anexos" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Fotos e Anexos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mockAttachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="relative cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedImage(attachment)}
                      >
                        <img
                          src={attachment}
                          alt={`Anexo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                      </div>
                    ))}
                  </div>
                  {mockAttachments.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-8">
                      Nenhum anexo disponível
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="agendamento" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Informações de Agendamento e Execução
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Data Agendada</label>
                        <p className="text-sm">
                          {ocorrencia.scheduled_date 
                            ? new Date(ocorrencia.scheduled_date).toLocaleDateString('pt-BR')
                            : 'Não agendada'
                          }
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Horário</label>
                        <p className="text-sm">{ocorrencia.scheduled_time || 'Não informado'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Empresa Responsável</label>
                        <p className="text-sm">{ocorrencia.empresa?.name || 'Não definida'}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Equipe</label>
                        <p className="text-sm">{ocorrencia.equipe?.name || 'Não definida'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Horas Estimadas</label>
                        <p className="text-sm">{ocorrencia.estimated_hours || 'Não informado'}h</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Horas Reais</label>
                        <p className="text-sm">{ocorrencia.actual_hours || 'Não informado'}h</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="observacoes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Observações e Notas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ocorrencia.execution_notes && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Notas de Execução</label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm">{ocorrencia.execution_notes}</p>
                        </div>
                      </div>
                    )}
                    {ocorrencia.cancel_reason && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Motivo do Cancelamento</label>
                        <div className="mt-1 p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-800">{ocorrencia.cancel_reason}</p>
                        </div>
                      </div>
                    )}
                    {!ocorrencia.execution_notes && !ocorrencia.cancel_reason && (
                      <p className="text-sm text-gray-500 text-center py-8">
                        Nenhuma observação disponível
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Visualizar Anexo</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <img
                src={selectedImage}
                alt="Anexo ampliado"
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default OcorrenciaViewer;
