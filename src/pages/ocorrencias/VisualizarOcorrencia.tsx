import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form'; // Importando Controller
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Importando o CSS do Leaflet
import L from 'leaflet';
import axios from 'axios'; // Importando axios para requisições HTTP
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Select from 'react-select'; // Importando react-select
import { ArrowLeft, Printer, CheckCircle, MapPin, Calendar, User, FileText, Camera, AlertCircle, Upload, X, Terminal, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Adicionado para o novo alerta
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { Ocorrencia } from '@/types';
import TimelineItem from '@/components/ocorrencias/TimelineItem';
import GalleryItem from '@/components/ocorrencias/GalleryItem';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ocorrenciasData from '@/utils/ocorrencias.json';
import regionaisGeoData from '@/utils/regionais_cordenadas.json';
import equipamentosPubData from '@/utils/equip_pub_pmf.json';

// Corrigindo o caminho do ícone padrão do Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Corrigindo o caminho do ícone padrão do Leaflet

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// Schema do Zod com validação condicional
const ocorrenciaSchema = z.object({
  occurrence_date: z.string().min(1, 'Data da ocorrência é obrigatória'),
  occurrence_type: z.string().min(1, 'Tipo de ocorrência é obrigatório'),
  special_schedule_date: z.string().optional(),
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
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  cep: z.string().optional(),
  neighborhood: z.string().optional(),
  priority: z.enum(['baixa', 'media', 'alta'], { errorMap: () => ({ message: "Selecione uma prioridade" }) }),
  description: z.string().min(1, 'Descrição é obrigatória'),
  attachments: z.array(z.string()).optional(),
  observations: z.string().optional(),
  should_schedule: z.boolean().default(false),
  schedule_date: z.string().optional(),
})
.refine(data => !data.should_schedule || !!data.schedule_date, {
  message: 'Data de agendamento é obrigatória.',
  path: ['schedule_date'],
})
.refine(data => data.occurrence_type !== 'Especial' || !!data.special_schedule_date, {
  message: 'Agendamento da ocorrência é obrigatório para o tipo Especial.',
  path: ['special_schedule_date'],
});

interface OcorrenciaDetalhada extends Ocorrencia {
  bairro: string;
  regional_name: string;
  tipo_de_ocorrencia: string;
  service_type: string;
  equipe_id?: string;
  description: string;
}

interface EquipamentoPublico {
    id: number;
    tipo: string;
    regional: string;
    bairro: string;
    nome: string;
    endereco: string;
}

const regionalMap: { [key: string]: string } = {
  '1': 'Regional I', '2': 'Regional II', '3': 'Regional III', '4': 'Regional IV',
  '5': 'Regional V', '6': 'Regional VI',
};


export const mockOcorrencias: OcorrenciaDetalhada[] = (ocorrenciasData as Ocorrencia[]).map(ocorrencia => ({
  ...ocorrencia,
  regional_name: regionalMap[ocorrencia.regional_id] || 'Desconhecida',
}));

type OcorrenciaFormData = z.infer<typeof ocorrenciaSchema>;

const mockAttachments = [{ id: '1', src: '/placeholder.svg', alt: 'Foto inicial do problema', type: 'image' as const, category: 'Iniciais' }];
const territories = [{ id: '1', name: 'Centro' }, { id: '2', 'name': 'Norte' }, { id: '3', 'name': 'Sul' }];
const fiscais = [{ id: '1', name: 'João Silva (Fiscal)'}, { id: '2', name: 'Maria Santos (Fiscal)'}, { id: '3', name: 'Carlos Pereira (Fiscal)'}];

// ✨ NOVO: Formatando os dados para o react-select
const equipmentOptions = (equipamentosPubData as EquipamentoPublico[]).map(eq => ({
    value: String(eq.id),
    label: eq.nome
}));

const getStatusColor = (status: string) => ({ 'criada': 'bg-gray-100 text-gray-800', 'encaminhada': 'bg-blue-100 text-blue-800', 'autorizada': 'bg-teal-100 text-teal-800', 'cancelada': 'bg-red-100 text-red-800', 'devolvida': 'bg-orange-100 text-orange-800', 'em_analise': 'bg-yellow-100 text-yellow-800', 'agendada': 'bg-purple-100 text-purple-800', 'em_execucao': 'bg-cyan-100 text-cyan-800', 'executada': 'bg-green-100 text-green-800', 'concluida': 'bg-emerald-100 text-emerald-800'}[status] || 'bg-gray-100 text-gray-800');
const getStatusLabel = (status: string) => ({ 'criada': 'Criada', 'encaminhada': 'Encaminhada', 'autorizada': 'Autorizada', 'cancelada': 'Cancelada', 'devolvida': 'Devolvida', 'em_analise': 'Em Análise', 'agendada': 'Agendada', 'em_execucao': 'Em Execução', 'executada': 'Executada', 'concluida': 'Concluída'}[status] || status);
const getPriorityColor = (priority: string) => ({ 'baixa': 'bg-green-100 text-green-800', 'media': 'bg-yellow-100 text-yellow-800', 'alta': 'bg-red-100 text-red-800'}[priority] || 'bg-gray-100 text-gray-800');

export default function OcorrenciaFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const isViewMode = Boolean(id);
  const [viewData, setViewData] = useState<Partial<OcorrenciaDetalhada>>({});
  const [attachments, setAttachments] = useState<string[]>([]);
  const [equipmentSelected, setEquipmentSelected] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSpecialAlert, setShowSpecialAlert] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [locationAlert, setLocationAlert] = useState<{ type: 'error' | 'warning' | 'success'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    control, // Adicionando control para o Controller
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

  // Observar os campos de endereço para a geocodificação
  const streetName = watch('street_name');
  const streetNumber = watch('street_number');
  const neighborhood = watch('neighborhood');

  // Observar latitude e longitude para o mapa
  const latitude = watch('latitude');
  const longitude = watch('longitude');
  const mapPosition: [number, number] | null = latitude && longitude ? [parseFloat(latitude), parseFloat(longitude)] : null;

  useEffect(() => {
    if (occurrenceType === 'Especial') {
      setShowSpecialAlert(true);
    } else {
      setShowSpecialAlert(false);
    }
  }, [occurrenceType]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (isViewMode && id) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = mockOcorrencias.find(o => o.id === id);
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
  
  const handleEquipmentChange = (equipmentId: string | undefined) => {
    const equipment = (equipamentosPubData as EquipamentoPublico[]).find(eq => String(eq.id) === equipmentId);
    if (equipment) {
      setValue('territory_id', territories.find(t => t.name === equipment.regional)?.id || '');
      setValue('street_name', equipment.endereco);
      setValue('street_number', '');
      setValue('cep', '');
      setValue('neighborhood', equipment.bairro);
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

  const handleGeocode = async () => {
    setLocationAlert(null); // Limpa o alerta anterior
    const { street_name, street_number, neighborhood } = getValues();
    if (!street_name || !neighborhood) {
      return;
    }

    setIsGeocoding(true);
    const addressQuery = `${street_name}, ${street_number || ''}, ${neighborhood}, Fortaleza, Ceará, Brazil`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}&addressdetails=1`;

    try {
      const response = await axios.get(url);
      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        const lat = parseFloat(result.lat).toFixed(7);
        const lng = parseFloat(result.lon).toFixed(7);

        console.log(`Coordenadas encontradas: Latitude ${lat}, Longitude ${lng}`);

        setValue('latitude', lat);
        setValue('longitude', lng);
        setLocationAlert({ type: 'success', message: 'Coordenadas encontradas com sucesso!' });
      } else {
        setLocationAlert({ type: 'warning', message: 'Endereço não encontrado na região metropolitana de Fortaleza.' });
      }
    } catch (error) {
      setLocationAlert({ type: 'error', message: 'Ocorreu um erro ao buscar as coordenadas. Tente novamente.' });
    } finally {
      setIsGeocoding(false);
    }
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

               {isViewMode && viewData.status === 'executada' && (
                 <Button onClick={() => navigate(`/ocorrencias/${id}/vistoria_final`)}>
                   <CheckCircle className="w-4 h-4 mr-2" />
                   Vistoria Final
                 </Button>
               )}
               
               {isViewMode ? (
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
                    <div className="lg:col-span-12">
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
                      <option value="Presencial">Presencial</option>
                      <option value="Oficio">Ofício</option>
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
                    <select id="occurrence_type" {...register('occurrence_type')} disabled={isViewMode} 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="">Selecione o tipo</option>
                      <option value="Limpeza de canal">Limpeza de canal</option>
                      <option value="Limpeza de boca de lobo">Limpeza de Boca de Lobo</option>
                      <option value="Capina">Capina</option>
                      <option value="Varrição">Varrição</option>
                      <option value="Retirada de animais mortos">Retirada de animais mortos </option>
                      <option value="Especial">Especial</option>
                    </select>
                    {errors.occurrence_type && <p className="text-sm text-red-500">{errors.occurrence_type.message}</p>}
                  </div>
                  
                   <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade *</Label>
                    <select id="priority" {...register('priority')} disabled={isViewMode} 
                    className="flex h-10 w-full rounded-md border border-input bg-background 
                    px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
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
                {locationAlert && (
                  <Alert variant={locationAlert.type === 'error' ? 'destructive' : 'default'} className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{locationAlert.type === 'error' ? 'Erro de Localização' : 'Aviso'}</AlertTitle>
                    <AlertDescription>
                      {locationAlert.message}
                    </AlertDescription>
                  </Alert>
                )}
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
                         {/* ✨ ATUALIZAÇÃO: Substituindo <select> por react-select com Controller */}
                         <Controller
                            name="public_equipment_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    inputId="public_equipment_id"
                                    options={equipmentOptions}
                                    isDisabled={isViewMode}
                                    placeholder="Selecione ou pesquise o equipamento"
                                    value={equipmentOptions.find(option => option.value === field.value)}
                                    onChange={option => {
                                        const value = option ? option.value : '';
                                        field.onChange(value);
                                        handleEquipmentChange(value);
                                    }}
                                    styles={{
                                        control: (base) => ({
                                          ...base,
                                          minHeight: '40px',
                                          borderColor: errors.public_equipment_id ? '#ef4444' : '#e5e7eb',
                                          '&:hover': {
                                            borderColor: errors.public_equipment_id ? '#ef4444' : '#d1d5db',
                                          },
                                        }),
                                        menu: (base) => ({ ...base, zIndex: 50 })
                                    }}
                                />
                            )}
                         />
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
                       <Input id="street_name" {...register('street_name')} disabled={isViewMode || equipmentSelected} placeholder="Nome do logradouro" onBlur={handleGeocode} />
                   </div>
                   <div className="space-y-2">
                       <Label htmlFor="street_number">Número</Label>
                       <Input id="street_number" {...register('street_number')} disabled={isViewMode || equipmentSelected} placeholder="Número" onBlur={handleGeocode} />
                   </div>
                   <div className="space-y-2">
                       <Label htmlFor="cep">CEP</Label>
                       <Input id="cep" {...register('cep')} disabled={isViewMode || equipmentSelected} placeholder="00000-000" onBlur={handleGeocode} />
                   </div>
                   <div className="space-y-2">
                       <Label htmlFor="neighborhood">Bairro</Label>
                       <Input id="neighborhood" {...register('neighborhood')} disabled={isViewMode || equipmentSelected} placeholder="Bairro" onBlur={handleGeocode} />
                   </div>
                   <div className="space-y-2">
                       <Label htmlFor="complement">Complemento</Label>
                       <Input id="complement" {...register('complement')} disabled={isViewMode || equipmentSelected} placeholder="Complemento"/>
                   </div>
                   <div className="space-y-2">
                       <Label htmlFor="latitude">Latitude</Label>
                       <Input id="latitude" {...register('latitude')} disabled placeholder={isGeocoding ? "Buscando..." : "Preenchido automaticamente"} className="bg-gray-100" />
                   </div>
                   <div className="space-y-2">
                       <Label htmlFor="longitude">Longitude</Label>
                       <Input id="longitude" {...register('longitude')} disabled placeholder={isGeocoding ? "Buscando..." : "Preenchido automaticamente"} className="bg-gray-100" />
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
