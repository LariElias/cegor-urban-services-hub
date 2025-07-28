
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, CheckCircle, MapPin, Calendar, User, FileText, Camera, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { Ocorrencia, getPermittedActions } from '@/types';
import TimelineItem from '@/components/ocorrencias/TimelineItem';
import GalleryItem from '@/components/ocorrencias/GalleryItem';

// Mock data expandido
const mockOcorrencia: Ocorrencia = {
  id: '2',
  protocol: 'OCR-2024-002',
  description: 'Reparo necessário na calçada em frente ao equipamento público devido a danos causados por raízes de árvores',
  service_type: 'Manutenção',
  public_equipment_name: 'Escola Municipal João Silva',
  priority: 'media',
  status: 'agendada',
  
  // Dados básicos
  occurrence_date: '2024-01-15',
  occurrence_type: 'Preventiva',
  origin: 'SIGEP',
  origin_number: '2024-001234',
  
  // Localização
  address: 'Rua das Palmeiras, 456',
  latitude: -3.7319,
  longitude: -38.5267,
  
  // Responsabilidades
  regional_id: '2',
  regional: { 
    id: '2', 
    name: 'Regional Centro', 
    code: 'RC', 
    address: 'Av. Central, 100', 
    phone: '(85) 3456-7890', 
    responsible: 'Maria Santos', 
    created_at: '2024-01-01T00:00:00Z', 
    updated_at: '2024-01-01T00:00:00Z' 
  },
  fiscal_id: '2',
  fiscal: { 
    id: '2', 
    name: 'João Oliveira', 
    cpf: '987.654.321-00', 
    phone: '(85) 9876-5432', 
    email: 'joao.oliveira@prefeitura.gov.br', 
    regional_id: '2',
    created_at: '2024-01-01T00:00:00Z', 
    updated_at: '2024-01-01T00:00:00Z' 
  },
  
  // Agendamento
  scheduled_date: '2024-01-20T08:00:00Z',
  scheduled_time: '08:00',
  estimated_hours: 4,
  
  // Vistorias
  vistoria_previa_date: '2024-01-18T10:00:00Z',
  
  // Aprovações
  forwarded_by: '2',
  forwarded_at: '2024-01-16T14:00:00Z',
  approved_by_regional: '2',
  approved_at_regional: '2024-01-17T09:00:00Z',
  
  // Timestamps
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-18T10:00:00Z'
};

const mockAttachments = [
  { id: '1', src: '/placeholder.svg', alt: 'Foto inicial do problema', type: 'image' as const, category: 'Iniciais' },
  { id: '2', src: '/placeholder.svg', alt: 'Medição do dano', type: 'image' as const, category: 'Iniciais' },
  { id: '3', src: '/placeholder.svg', alt: 'Relatório técnico', type: 'pdf' as const, category: 'Documentos' },
];

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

export default function VisualizarOcorrencia() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular busca da API
    const fetchOcorrencia = async () => {
      try {
        setLoading(true);
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (id === '2') {
          setOcorrencia(mockOcorrencia);
        } else {
          // Ocorrência não encontrada
          setOcorrencia(null);
        }
      } catch (error) {
        console.error('Erro ao buscar ocorrência:', error);
        setOcorrencia(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOcorrencia();
  }, [id]);

  const generateTimeline = () => {
    if (!ocorrencia) return [];
    
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
        status: ocorrencia.status === 'agendada' ? 'current' as const : 'completed' as const
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

    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    navigate('/ocorrencias');
  };

  const canEncerrar = () => {
    if (!user) return false;
    const permittedActions = getPermittedActions(user.role, user.subrole);
    return permittedActions.includes('encerrar_ocorrencia');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando ocorrência...</p>
        </div>
      </div>
    );
  }

  if (!ocorrencia) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ocorrência não encontrada</h2>
          <p className="text-gray-600 mb-4">A ocorrência solicitada não foi encontrada ou você não tem permissão para visualizá-la.</p>
          <Button onClick={handleClose}>Voltar à Lista</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Fixo */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Ocorrência {ocorrencia.protocol}
              </h1>
              <Badge className={getStatusColor(ocorrencia.status)}>
                {getStatusLabel(ocorrencia.status)}
              </Badge>
              <Badge className={getPriorityColor(ocorrencia.priority)}>
                {ocorrencia.priority}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              {canEncerrar() && (
                <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Encerrar
                </Button>
              )}
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" onClick={handleClose}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Fechar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Corpo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dados">Dados Básicos</TabsTrigger>
            <TabsTrigger value="localizacao">Localização</TabsTrigger>
            <TabsTrigger value="andamento">Andamento</TabsTrigger>
            <TabsTrigger value="anexos">Anexos</TabsTrigger>
            <TabsTrigger value="observacoes">Observações</TabsTrigger>
          </TabsList>

          <TabsContent value="dados" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Dados Básicos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Data da Ocorrência</Label>
                      <Input 
                        type="date" 
                        value={ocorrencia.occurrence_date || ''} 
                        disabled 
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo de Ocorrência</Label>
                      <Input 
                        value={ocorrencia.occurrence_type || ''} 
                        disabled 
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Origem</Label>
                      <Input 
                        value={ocorrencia.origin || ''} 
                        disabled 
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Número de Origem</Label>
                      <Input 
                        value={ocorrencia.origin_number || ''} 
                        disabled 
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Protocolo</Label>
                      <Input 
                        value={ocorrencia.protocol} 
                        disabled 
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Equipamento Público</Label>
                      <Input 
                        value={ocorrencia.public_equipment_name} 
                        disabled 
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Território</Label>
                      <Input 
                        value={ocorrencia.territorio?.name || 'Não informado'} 
                        disabled 
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fiscal Designado</Label>
                      <Input 
                        value={ocorrencia.fiscal?.name || 'Não informado'} 
                        disabled 
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prioridade</Label>
                      <div className="flex items-center">
                        <Badge className={getPriorityColor(ocorrencia.priority)}>
                          {ocorrencia.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Status Atual</Label>
                      <div className="flex items-center">
                        <Badge className={getStatusColor(ocorrencia.status)}>
                          {getStatusLabel(ocorrencia.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="localizacao" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Logradouro</Label>
                      <Input 
                        value={ocorrencia.address} 
                        disabled 
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bairro</Label>
                      <Input 
                        value={ocorrencia.equipamento?.bairro?.name || 'Não informado'} 
                        disabled 
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Regional</Label>
                      <Input 
                        value={ocorrencia.regional?.name || 'Não informado'} 
                        disabled 
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Latitude</Label>
                      <Input 
                        value={ocorrencia.latitude?.toString() || ''} 
                        disabled 
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Longitude</Label>
                      <Input 
                        value={ocorrencia.longitude?.toString() || ''} 
                        disabled 
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="andamento" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Linha do Tempo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generateTimeline().map((event, index) => (
                    <TimelineItem
                      key={index}
                      date={event.date}
                      title={event.title}
                      description={event.description}
                      status={event.status}
                      isLast={index === generateTimeline().length - 1}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anexos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Anexos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mockAttachments.map((attachment) => (
                    <GalleryItem
                      key={attachment.id}
                      src={attachment.src}
                      alt={attachment.alt}
                      type={attachment.type}
                      category={attachment.category}
                      onClick={() => setSelectedImage(attachment.src)}
                    />
                  ))}
                </div>
                {mockAttachments.length === 0 && (
                  <div className="text-center py-12">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum anexo disponível</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="observacoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea 
                    value={ocorrencia.description} 
                    disabled 
                    className="bg-gray-50"
                    rows={3}
                  />
                </div>
                
                {ocorrencia.execution_notes && (
                  <div className="space-y-2">
                    <Label>Notas de Execução</Label>
                    <Textarea 
                      value={ocorrencia.execution_notes} 
                      disabled 
                      className="bg-gray-50"
                      rows={3}
                    />
                  </div>
                )}
                
                {ocorrencia.cancel_reason && (
                  <div className="space-y-2">
                    <Label>Motivo do Cancelamento</Label>
                    <Textarea 
                      value={ocorrencia.cancel_reason} 
                      disabled 
                      className="bg-red-50"
                      rows={3}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Visualização de Imagem */}
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
    </div>
  );
}
