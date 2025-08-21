import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Printer, CheckCircle, MapPin, Calendar, User, FileText, Camera, AlertCircle, Upload, X, Terminal, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { Ocorrencia } from '@/types';
import TimelineItem from '@/components/ocorrencias/TimelineItem';
import GalleryItem from '@/components/ocorrencias/GalleryItem';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Schema do Zod com validação condicional
const ocorrenciaSchema = z.object({
  occurrence_date: z.string().min(1, 'Data da ocorrência é obrigatória'),
  occurrence_type: z.string().min(1, 'Tipo de ocorrência é obrigatório'),
  special_schedule_date: z.string().optional(), // Novo campo
  origin: z.string().min(1, 'Origem é obrigatória'),
  origin_number: z.string().min(1, 'Número de origem é obrigatório'),
  is_inside_equipment: z.boolean().optional(),
  public_equipment_id: z.string().min(1, 'Equipamento público é obrigatório'),
  territory_id: z.string().optional(),
  fiscal_id: z.string().min(1, 'É obrigatório selecionar um fiscal'),
  street_type: z.string().optional(),
  street_name: z.string().optional(),
  street_number: z.string().optional(),
  complement: z.string().optional(),
  cep: z.string().optional(),
  neighborhood: z.string().optional(),
  priority: z.enum(['baixa', 'media', 'alta'], { errorMap: () => ({ message: "Selecione uma prioridade" }) }),
  description: z.string().min(1, 'Descrição é obrigatória'),
  attachments: z.array(z.string()).optional(),
  observations: z.string().optional(),
  should_schedule: z.boolean().default(false),
  schedule_date: z.string().optional(),
})
.refine(data => {
  if (data.should_schedule) {
    return !!data.schedule_date;
  }
  return true;
}, {
  message: 'Data de agendamento é obrigatória.',
  path: ['schedule_date'],
})
.refine(data => {
  if (data.occurrence_type === 'Especial') {
    return !!data.special_schedule_date;
  }
  return true;
}, {
  message: 'Agendamento da ocorrência é obrigatório para o tipo Especial.',
  path: ['special_schedule_date'],
});


type OcorrenciaFormData = z.infer<typeof ocorrenciaSchema>;

// Mock data com um exemplo de ocorrência "executada" para testar o botão
const mockOcorrencias: Record<string, Ocorrencia> = {
  '1': { id: '1', protocol: 'OCR-2024-001', description: 'Limpeza de praça pública necessária...', public_equipment_id: '1', public_equipment_name: 'Praça da Liberdade', priority: 'alta', status: 'criada', occurrence_date: '2024-07-14', occurrence_type: 'Varrição', origin: 'Ouvidoria', origin_number: '2024-001233', territory_id: '1', street_name: 'Praça da Liberdade', street_number: 's/n', neighborhood: 'Centro-Sul', fiscal_id: '1', should_schedule: true, schedule_date: '2024-07-20', observations: 'Urgente.' },
  '2': { id: '2', protocol: 'OCR-2024-001', description: 'Limpeza de praça pública necessária...', public_equipment_id: '1', public_equipment_name: 'Praça da Liberdade', priority: 'alta', status: 'criada', occurrence_date: '2024-07-14', occurrence_type: 'Varrição', origin: 'Ouvidoria', origin_number: '2024-001233', territory_id: '1', street_name: 'Praça da Liberdade', street_number: 's/n', neighborhood: 'Centro-Sul', fiscal_id: '1', should_schedule: true, schedule_date: '2024-07-20', observations: 'Urgente.' },
  '6': { id: '6', protocol: 'OCR-2024-006', description: 'Pintura de quadra no Cuca Jangurussu', public_equipment_name: 'Cuca Jangurussu', priority: 'baixa', status: 'executada', occurrence_date: '2024-07-15', occurrence_type: 'Pintura', origin: 'SPU', origin_number: '2024-55123', territory_id: '4', street_name: 'Av. Gov. Leonel Brizola', street_number: 's/n', neighborhood: 'Jangurussu', fiscal_id: '4' },
  '13': { id: '13', protocol: 'OCR-2024-006', description: 'Pintura de quadra no Cuca Jangurussu', public_equipment_name: 'Cuca Jangurussu', priority: 'baixa', status: 'executada', occurrence_date: '2024-07-15', occurrence_type: 'Pintura', origin: 'SPU', origin_number: '2024-55123', territory_id: '4', street_name: 'Av. Gov. Leonel Brizola', street_number: 's/n', neighborhood: 'Jangurussu', fiscal_id: '4' },
};
const mockAttachments = [{ id: '1', src: '/placeholder.svg', alt: 'Foto inicial do problema', type: 'image' as const, category: 'Iniciais' }];
const publicEquipments = [
    { id: '1', name: 'Praça Central', territory: 'Centro', street: 'Rua das Flores', number: '123', cep: '30000-000', neighborhood: 'Centro' },
    { id: '2', name: 'Parque Municipal', territory: 'Norte', street: 'Av. Brasil', number: '456', cep: '30001-000', neighborhood: 'Norte' },
];
const territories = [{ id: '1', name: 'Centro' }, { id: '2', 'name': 'Norte' }, { id: '3', 'name': 'Sul' }];
const fiscais = [{ id: '1', name: 'João Silva (Fiscal)'}, { id: '2', name: 'Maria Santos (Fiscal)'}, { id: '3', name: 'Carlos Pereira (Fiscal)'}];

const getStatusColor = (status: string) => ({ 'criada': 'bg-gray-100 text-gray-800', 'encaminhada': 'bg-blue-100 text-blue-800', 'autorizada': 'bg-teal-100 text-teal-800', 'cancelada': 'bg-red-100 text-red-800', 'devolvida': 'bg-orange-100 text-orange-800', 'em_analise': 'bg-yellow-100 text-yellow-800', 'agendada': 'bg-purple-100 text-purple-800', 'em_execucao': 'bg-cyan-100 text-cyan-800', 'executada': 'bg-green-100 text-green-800', 'concluida': 'bg-emerald-100 text-emerald-800'}[status] || 'bg-gray-100 text-gray-800');
const getStatusLabel = (status: string) => ({ 'criada': 'Criada', 'encaminhada': 'Encaminhada', 'autorizada': 'Autorizada', 'cancelada': 'Cancelada', 'devolvida': 'Devolvida', 'em_analise': 'Em Análise', 'agendada': 'Agendada', 'em_execucao': 'Em Execução', 'executada': 'Executada', 'concluida': 'Concluída'}[status] || status);
const getPriorityColor = (priority: string) => ({ 'baixa': 'bg-green-100 text-green-800', 'media': 'bg-yellow-100 text-yellow-800', 'alta': 'bg-red-100 text-red-800'}[priority] || 'bg-gray-100 text-gray-800');

export default function OcorrenciaFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const isViewMode = Boolean(id);
  const [viewData, setViewData] = useState<Partial<Ocorrencia>>({});
  const [attachments, setAttachments] = useState<string[]>([]);
  const [equipmentSelected, setEquipmentSelected] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSpecialAlert, setShowSpecialAlert] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<OcorrenciaFormData>({
    resolver: zodResolver(ocorrenciaSchema),
    defaultValues: {
      should_schedule: false,
      priority: undefined,
      occurrence_date: new Date().toISOString().split('T')[0],
    }
  });

  const shouldSchedule = watch('should_schedule');
  const occurrenceType = watch('occurrence_type');
  const isInsideEquipment = watch('is_inside_equipment');

  // ✨ NOVO CÓDIGO AQUI ✨
  useEffect(() => {
    if (occurrenceType === 'Especial') {
      setShowSpecialAlert(true);
    } else {
      setShowSpecialAlert(false); // Esconde o alerta se o usuário mudar para outra opção
    }
  }, [occurrenceType]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (isViewMode && id) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = mockOcorrencias[id];
        if (data) {
          setViewData(data);
          reset(data);
          if(data.public_equipment_id) {
            setEquipmentSelected(true);
          }
        }
      }
      setLoading(false);
    };
    loadData();
  }, [id, isViewMode, reset]);
  
  const handleEquipmentChange = (equipmentId: string) => {
    const equipment = publicEquipments.find(eq => eq.id === equipmentId);
    if (equipment) {
      setValue('territory_id', territories.find(t => t.name === equipment.territory)?.id || '');
      setValue('street_name', equipment.street);
      setValue('street_number', equipment.number);
      setValue('cep', equipment.cep);
      setValue('neighborhood', equipment.neighborhood);
      setEquipmentSelected(true);
    } else {
      setEquipmentSelected(false);
      setValue('territory_id', '');
      setValue('street_name', '');
      setValue('street_number', '');
      setValue('cep', '');
      setValue('neighborhood', '');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newAttachments = files.map(file => URL.createObjectURL(file));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: OcorrenciaFormData) => {
    console.log("Salvando nova ocorrência:", { ...data, attachments });
    alert('Ocorrência salva com sucesso! (Verifique o console)');
    navigate('/ocorrencias');
  };

  const handleGoBack = () => navigate('/ocorrencias');

  const [equipamentoPublico, setEquipamentoPublico] = useState("nao") 

  if (loading) return <div className="flex items-center justify-center h-screen"><p>Carregando...</p></div>;
  if (isViewMode && !viewData.id) return <div className="text-center p-8"><AlertCircle className="mx-auto h-12 w-12 text-gray-400" /><h3 className="mt-2 text-sm font-medium text-gray-900">Ocorrência não encontrada</h3><div className="mt-6"><Button onClick={handleGoBack}>Voltar</Button></div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
       <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {isViewMode ? `Ocorrência ${viewData.protocol}` : 'Nova Ocorrência'}
              </h1>
              {isViewMode && viewData.status && viewData.priority && (
                <>
                  <Badge className={getStatusColor(viewData.status)}>{getStatusLabel(viewData.status)}</Badge>
                  <Badge className={getPriorityColor(viewData.priority)}>{viewData.priority}</Badge>
                </>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleGoBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {isViewMode ? 'Fechar' : 'Cancelar'}
              </Button>

              {/* ATUALIZAÇÃO: Botão de Vistoria Final condicional */}
              {isViewMode && viewData.status === 'executada' && (
                <Button onClick={() => navigate(`/ocorrencias/${id}/vistoria_final`)}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Vistoria Final
                </Button>
              )}
              
              {isViewMode ? (
                // O botão de imprimir pode ser mantido ou removido conforme sua preferência
                <Button onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" />Imprimir</Button>
              ) : (
                <Button type="submit" form="ocorrencia-form">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <form id="ocorrencia-form" onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dados" className="w-full">
          <TabsList className={`grid w-full ${isViewMode ? 'grid-cols-5' : 'grid-cols-3'}`}>
            <TabsTrigger value="dados">Dados Básicos</TabsTrigger>
            <TabsTrigger value="localizacao">Localização</TabsTrigger>
            <TabsTrigger value="descricao">Descrição e Ações</TabsTrigger>
            {isViewMode && <TabsTrigger value="andamento">Andamento</TabsTrigger>}
            {isViewMode && <TabsTrigger value="anexos">Anexos</TabsTrigger>}
          </TabsList>

          <TabsContent value="dados">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><FileText />Dados da Ocorrência</CardTitle></CardHeader>
              <CardContent>
                  {showSpecialAlert && (
                    <div className="lg:col-span-12"> {/* Ocupa toda a largura da linha no grid */}
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Atenção: Tipo Especial Selecionado</AlertTitle>
                        <AlertDescription>
                          Ao selecionar "Especial", o fiscal designado poderá fazer o direcionamento da equipe diretamente.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origem *</Label>
                    <select id="origin" {...register('origin')} disabled={isViewMode} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="">Selecione a origem</option>
                      {/* <option value="SPU">SPU</option>
                      <option value="SIGEP">SIGEP</option> */}
                      <option value="Presencial">Presencial</option>
                      <option value="Presencial">Ofício</option>
                    </select>
                    {errors.origin && <p className="text-sm text-red-500">{errors.origin.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="origin_number">Número de Origem *</Label>
                    <Input id="origin_number" {...register('origin_number')} disabled={isViewMode} placeholder="Protocolo do sistema de origem" />
                    {errors.origin_number && <p className="text-sm text-red-500">{errors.origin_number.message}</p>}
                   </div>
                  <div className="space-y-2">
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occurrence_type">Tipo de Ocorrência *</Label>
                    <select id="occurrence_type" {...register('occurrence_type')} disabled={isViewMode} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="">Selecione o tipo</option>
                      <option value="limp_canal">Limpeza de canal</option>
                      <option value="limp_boca">Limpeza de Boca de Lobo</option>
                      <option value="capina">Capina</option>
                      <option value="varricao">Varrição</option>
                      <option value="retirada">Retirada de animais mortos </option>
                      <option value="Especial">Especial</option>
                    </select>
                    {errors.occurrence_type && <p className="text-sm text-red-500">{errors.occurrence_type.message}</p>}
                  </div>
                  

                   <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade *</Label>
                    <select id="priority" {...register('priority')} disabled={isViewMode} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="">Selecione a prioridade</option>
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </select>
                    {errors.priority && <p className="text-sm text-red-500">{errors.priority.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fiscal_id">Fiscal para Vistoria *</Label>
                    <select id="fiscal_id" {...register('fiscal_id')} disabled={isViewMode} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="">Selecione o fiscal</option>
                      {fiscais.map(fiscal => <option key={fiscal.id} value={fiscal.id}>{fiscal.name}</option>)}
                    </select>
                    {errors.fiscal_id && <p className="text-sm text-red-500">{errors.fiscal_id.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="localizacao">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><MapPin />Localização</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <Label htmlFor="equipamento-publico">Essa ocorrência é em um equip. público</Label>
                        <RadioGroup 
                          value={equipamentoPublico}
                          onValueChange={setEquipamentoPublico}
                          name="equipamento-publico"
                          id="equipamento-publico" 
                          className="flex space-x-4"
                        >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sim" id="radio-sim" />
                          <Label htmlFor="radio-sim">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nao" id="radio-nao" />
                          <Label htmlFor="radio-nao">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {equipamentoPublico === "sim" && (
                      <>
                        <div className="space-y-2 lg:col-span-3">
                          <Label htmlFor="public_equipment_id">Equipamento Público *</Label>
                          <select
                            id="public_equipment_id"
                            {...register("public_equipment_id")}
                            disabled={isViewMode}
                            onChange={(e) => handleEquipmentChange(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Selecione o equipamento</option>
                            {publicEquipments.map((eq) => (
                              <option key={eq.id} value={eq.id}>
                                {eq.name}
                              </option>
                            ))}
                          </select>
                          {errors.public_equipment_id && (
                            <p className="text-sm text-red-500">{errors.public_equipment_id.message}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 lg:col-span-3">
                          <Checkbox
                            id="is_inside_equipment"
                            checked={isInsideEquipment}
                            onCheckedChange={(checked) => setValue('is_inside_equipment', Boolean(checked))}
                            disabled={isViewMode}
                          />
                          <Label htmlFor="is_inside_equipment" className="font-normal">
                            A ocorrência é DENTRO do equipamento público? (Marque se for dentro)
                          </Label>
                        </div>
                      </>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="territory_id">Território</Label>
                        <select id="territory_id" {...register('territory_id')} disabled={isViewMode || equipmentSelected} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
                          <option value="">Selecione o território</option>
                          {territories.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="street_name">Logradouro</Label>
                        <Input id="street_name" {...register('street_name')} disabled={isViewMode || equipmentSelected} placeholder="Nome do logradouro" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="street_number">Número</Label>
                        <Input id="street_number" {...register('street_number')} disabled={isViewMode || equipmentSelected} placeholder="Número" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cep">CEP</Label>
                        <Input id="cep" {...register('cep')} disabled={isViewMode || equipmentSelected} placeholder="00000-000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="neighborhood">Bairro</Label>
                        <Input id="neighborhood" {...register('neighborhood')} disabled={isViewMode || equipmentSelected} placeholder="Bairro" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input id="complement" {...register('complement')} disabled={isViewMode || equipmentSelected} placeholder="Complemento" />
                    </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="descricao">
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><User />Descrição Detalhada</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="description">Descrição *</Label>
                            <Textarea id="description" {...register('description')} disabled={isViewMode} placeholder="Descreva a ocorrência" rows={4} />
                            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="observations">Observações</Label>
                            <Textarea id="observations" {...register('observations')} disabled={isViewMode} placeholder="Observações adicionais" rows={2} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Camera />Anexos</CardTitle></CardHeader>
                    <CardContent>
                        {!isViewMode && (
                             <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Input type="file" multiple accept="image/*,application/pdf" onChange={handleFileUpload} className="hidden" id="file-upload" />
                                    <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                                    <Upload className="w-4 h-4 mr-2" /> Adicionar Arquivos
                                    </Button>
                                </div>
                                {attachments.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                                    {attachments.map((attachment, index) => (
                                        <div key={index} className="relative">
                                        <img src={attachment} alt={`Anexo ${index + 1}`} className="w-full h-24 object-cover rounded" />
                                        <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0" onClick={() => removeAttachment(index)}>
                                            <X className="w-3 h-3" />
                                        </Button>
                                        </div>
                                    ))}
                                    </div>
                                )}
                            </div>
                        )}
                         {isViewMode && <p className="text-sm text-muted-foreground">Para visualizar os anexos, acesse a aba "Anexos".</p>}
                    </CardContent>
                </Card>
            </div>
          </TabsContent>

          {isViewMode && (
            <>
              <TabsContent value="andamento">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Calendar />Linha do Tempo</CardTitle></CardHeader>
                  <CardContent>
                    <p>Timeline da ocorrência {viewData.protocol}.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="anexos">
                <Card>
                   <CardHeader><CardTitle className="flex items-center gap-2"><Camera />Galeria de Anexos</CardTitle></CardHeader>
                   <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {mockAttachments.map((attachment) => (
                          <GalleryItem key={attachment.id} {...attachment} onClick={() => setSelectedImage(attachment.src)} />
                        ))}
                      </div>
                   </CardContent>
                </Card>
              </TabsContent>
            </>
          )}

        </Tabs>
      </form>
      
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader><DialogTitle>Visualizar Anexo</DialogTitle></DialogHeader>
            <div className="flex justify-center p-4">
              <img src={selectedImage} alt="Anexo ampliado" className="max-w-full max-h-[80vh] object-contain" />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}