import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Eye, 
  Edit, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Building, 
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Camera,
  FileText,
  ArrowLeft
} from 'lucide-react';

interface Ocorrencia {
  id: string;
  protocolo: string;
  tipo: string;
  subtipo?: string;
  descricao: string;
  status: 'Criada' | 'Agendada' | 'Em Execução' | 'Concluída' | 'Cancelada';
  prioridade: 'Baixa' | 'Média' | 'Alta';
  bairro: string;
  regional: string;
  endereco: string;
  latitude: string;
  longitude: string;
  data_criacao: string;
  data_agendamento?: string;
  origem: string;
  requerente: string;
  telefone?: string;
  observacoes?: string;
  public_equipment_name?: string;
  empresa_responsavel?: string;
  fiscal_responsavel?: string;
  fotos_antes?: string[];
  fotos_depois?: string[];
}

const VisualizarOcorrencia = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const mockOcorrencia: Ocorrencia = {
    id: "1",
    protocolo: "2024001234",
    tipo: "Limpeza de Via",
    subtipo: "Varrição",
    descricao: "Solicitação de limpeza na Rua das Flores devido ao acúmulo de folhas e detritos.",
    status: "Em Execução",
    prioridade: "Média",
    bairro: "Centro",
    regional: "Sede",
    endereco: "Rua das Flores, 123",
    latitude: "-25.4284",
    longitude: "-49.2733",
    data_criacao: "2024-01-15T08:30:00Z",
    data_agendamento: "2024-01-16T14:00:00Z",
    origem: "Telefone",
    requerente: "João Silva",
    telefone: "(41) 99999-9999",
    observacoes: "Local de grande circulação de pedestres",
    public_equipment_name: "Praça Central",
    empresa_responsavel: "LimpaCidade Ltda",
    fiscal_responsavel: "Maria Santos",
    fotos_antes: ["/placeholder.svg", "/placeholder.svg"],
    fotos_depois: ["/placeholder.svg"]
  };

  useEffect(() => {
    const fetchOcorrencia = async () => {
      try {
        setLoading(true);
        // Simulação de carregamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOcorrencia(mockOcorrencia);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar ocorrência",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOcorrencia();
  }, [id, toast]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Criada':
        return <AlertCircle className="w-4 h-4" />;
      case 'Agendada':
        return <Clock className="w-4 h-4" />;
      case 'Em Execução':
        return <Eye className="w-4 h-4" />;
      case 'Concluída':
        return <CheckCircle className="w-4 h-4" />;
      case 'Cancelada':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Criada':
        return 'bg-gray-100 text-gray-800';
      case 'Agendada':
        return 'bg-yellow-100 text-yellow-800';
      case 'Em Execução':
        return 'bg-blue-100 text-blue-800';
      case 'Concluída':
        return 'bg-green-100 text-green-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Alta':
        return 'bg-red-100 text-red-800';
      case 'Média':
        return 'bg-yellow-100 text-yellow-800';
      case 'Baixa':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    toast({
      title: "Sucesso",
      description: "Ocorrência atualizada com sucesso",
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!ocorrencia) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Ocorrência não encontrada</h2>
          <Button onClick={() => navigate('/ocorrencias')} className="mt-4">
            Voltar para Lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/ocorrencias')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Protocolo: {ocorrencia.protocolo}
            </h1>
            <p className="text-gray-600">{ocorrencia.tipo}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`${getStatusColor(ocorrencia.status)} flex items-center space-x-1`}>
            {getStatusIcon(ocorrencia.status)}
            <span>{ocorrencia.status}</span>
          </Badge>
          <Badge className={getPriorityColor(ocorrencia.prioridade)}>
            {ocorrencia.prioridade}
          </Badge>
          <Button onClick={handleEdit} variant={isEditing ? "default" : "outline"}>
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancelar' : 'Editar'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Ocorrência</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Tipo</Label>
                <p className="text-gray-900">{ocorrencia.tipo}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Subtipo</Label>
                <p className="text-gray-900">{ocorrencia.subtipo || 'N/A'}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Bairro</Label>
                <p className="text-gray-900">{ocorrencia.bairro}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Regional</Label>
                <p className="text-gray-900">{ocorrencia.regional}</p>
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-600">Endereço</Label>
                <p className="text-gray-900">{ocorrencia.endereco}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Equipamento Público</Label>
                <p className="text-gray-900">{ocorrencia.public_equipment_name || 'N/A'}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Origem</Label>
                <p className="text-gray-900">{ocorrencia.origem}</p>
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-600">Descrição</Label>
                {isEditing ? (
                  <Textarea
                    value={ocorrencia.descricao}
                    onChange={(e) => setOcorrencia({...ocorrencia, descricao: e.target.value})}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-gray-900">{ocorrencia.descricao}</p>
                )}
              </div>

              {ocorrencia.observacoes && (
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-600">Observações</Label>
                  {isEditing ? (
                    <Textarea
                      value={ocorrencia.observacoes}
                      onChange={(e) => setOcorrencia({...ocorrencia, observacoes: e.target.value})}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-gray-900">{ocorrencia.observacoes}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Requerente</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Nome</Label>
                <p className="text-gray-900">{ocorrencia.requerente}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Telefone</Label>
                <p className="text-gray-900">{ocorrencia.telefone || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Responsáveis</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Empresa Responsável</Label>
                <p className="text-gray-900">{ocorrencia.empresa_responsavel || 'N/A'}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Fiscal Responsável</Label>
                <p className="text-gray-900">{ocorrencia.fiscal_responsavel || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {(ocorrencia.fotos_antes?.length || ocorrencia.fotos_depois?.length) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Fotos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ocorrencia.fotos_antes?.length && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600 mb-2 block">Fotos Antes</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {ocorrencia.fotos_antes.map((foto, index) => (
                        <img
                          key={index}
                          src={foto}
                          alt={`Foto antes ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {ocorrencia.fotos_depois?.length && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600 mb-2 block">Fotos Depois</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {ocorrencia.fotos_depois.map((foto, index) => (
                        <img
                          key={index}
                          src={foto}
                          alt={`Foto depois ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <Label className="text-sm font-medium text-gray-600">Data de Criação</Label>
                  <p className="text-sm text-gray-900">
                    {new Date(ocorrencia.data_criacao).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              {ocorrencia.data_agendamento && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Data de Agendamento</Label>
                    <p className="text-sm text-gray-900">
                      {new Date(ocorrencia.data_agendamento).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <Label className="text-sm font-medium text-gray-600">Coordenadas</Label>
                  <p className="text-sm text-gray-900">
                    {ocorrencia.latitude}, {ocorrencia.longitude}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isEditing && (
                <Button onClick={handleSave} className="w-full">
                  Salvar Alterações
                </Button>
              )}
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/ocorrencias/${id}/agendamento`)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Agendar
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/ocorrencias/${id}/vistoria`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Vistoria
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/ocorrencias/${id}/acompanhamento`)}
              >
                <FileText className="w-4 h-4 mr-2" />
                Acompanhamento
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VisualizarOcorrencia;
